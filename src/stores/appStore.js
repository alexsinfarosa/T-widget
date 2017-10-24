import { observable, action, computed } from "mobx";
import { stations } from "stations";
import format from "date-fns/format";
import axios from "axios";
import spline from "cubic-spline";
import { jStat } from "jStat";
import isAfter from "date-fns/is_after";

import { index, arcData, transposeReduce } from "utils";

export default class appStore {
  constructor(fetch) {
    this.fetch = fetch;
  }
  // logic-------------------------------------------------------------------------
  @observable protocol = window.location.protocol;
  @observable isLoading = false;
  @action setIsLoading = d => (this.isLoading = d);
  @observable isPLoading = false;
  @action setIsPLoading = d => (this.isPLoading = d);
  @observable isGraph = false;
  @action setIsGraph = d => (this.isGraph = !this.isGraph);
  @observable selectedProjection = "Projection 2040-2069";
  @action setSelectedProjection = d => (this.selectedProjection = d);

  // Stations -----------------------------------------------------------------------
  @observable
  station = JSON.parse(localStorage.getItem("gauge-stations")) || stations[0];
  @action
  setStation = d => {
    this.station = stations.find(s => s.name === d);
    localStorage.setItem("gauge-stations", JSON.stringify(this.station));
  };

  // Slider -------------------------------------------------------------------------
  @observable
  temperature = JSON.parse(localStorage.getItem("temperature")) || 75;
  @action
  setTemperature = d => {
    this.temperature = d;
    localStorage.setItem("temperature", JSON.stringify(this.temperature));
  };

  // Observed data -------------------------------------------------------------------
  @observable observedData = [];

  @action setObservedData = d => (this.observedData = d);

  @computed
  get daysAboveThresholdThisYear() {
    if (this.observedData !== 0) {
      return this.observedData.slice(-1).map(arr => Number(arr[1]))[0];
    }
    return [];
  }

  @computed
  get observedDays() {
    if (this.observedData !== 0) {
      return this.observedData.map(arr => Number(arr[1]));
    }
    return [];
  }

  @computed
  get observedMean() {
    if (this.observedData !== 0) {
      return jStat.quantiles(this.observedDays, [0.5])[0];
    }
    return 0;
  }

  @computed
  get observedQuantiles() {
    console.log("Observed");
    const d = this.observedDays;
    if (d !== 0) {
      let existingItems = {};
      let quantiles = jStat.quantiles(d, [0, 0.25, 0.5, 0.75, 1]);
      quantiles = quantiles.map(x => Math.round(x));
      quantiles.forEach((value, i) => {
        let q;
        if (i === 0) q = 0;
        if (i === 1) q = 0.25;
        if (i === 2) q = 0.5;
        if (i === 3) q = 0.75;
        if (i === 4) q = 1;
        existingItems[value] = q;
      });
      console.log(existingItems);
      console.log(
        Object.values(jStat.quantiles(d, Object.values(existingItems))).map(q =>
          Math.round(q)
        )
      );
      return Object.values(
        jStat.quantiles(d, Object.values(existingItems))
      ).map(q => Math.round(q));
    }
  }

  @computed
  get observedIndex() {
    if (this.observedDays !== 0) {
      return index(this.daysAboveThresholdThisYear, this.observedQuantiles);
    }
    return [];
  }

  @computed
  get observedArcData() {
    return arcData(
      this.observedQuantiles,
      this.daysAboveThresholdThisYear,
      this.temperature,
      "New Record"
    ); // fix this
  }

  @computed
  get observedDataGraph() {
    const values = this.observedData.map(year => Number(year[1]));
    let results = [];
    this.observedData.forEach(d => {
      results.push({
        year: format(d[0], "YYYY"),
        "days above": Number(d[1]),
        mean: Math.round(jStat.quantiles(values, [0.5]))
      });
    });
    return results;
  }

  @action
  loadObservedData = () => {
    this.setIsLoading(true);
    // const seasonStart = format(addDays(new Date(), 1), "MM-DD");

    const params = {
      sid: this.station.sid,
      sdate: `POR-${format(new Date(), "MM-DD") // you can change back this to 1980-08-01
      }`,
      edate: format(new Date(), "YYYY-MM-DD"),
      elems: [
        {
          name: "maxt",
          interval: [1, 0, 0],
          duration: "std",
          season_start: "01-01",
          reduce: `cnt_ge_${this.temperature}`
        }
      ]
    };

    // console.log(params);

    return axios
      .post(`${this.protocol}//data.rcc-acis.org/StnData`, params)
      .then(res => {
        // console.log(res.data.data);
        this.setObservedData(res.data.data);
        this.setIsLoading(false);
      })
      .catch(err => {
        console.log("Failed to load observed data ", err);
      });
  };

  // Projections ----------------------------------------------------------

  @observable highEmission = 45;
  @action setHighEmission = d => (this.highEmission = d);

  @observable projectedData2040 = [];

  @action
  setProjectedData2040 = d => {
    this.projectedData2040 = d;
  };

  @action
  loadProjection2040() {
    this.setIsPLoading(true);
    // Subtract 5 months from the current month to get data for the spline function
    const month = Number(format(new Date(), "MM"));

    const params = {
      loc: [this.station.lon, this.station.lat],
      sdate: [2040, 1],
      edate: [2069, month],
      grid: `loca:wMean:rcp${this.highEmission}`,
      elems: [
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_80` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_85` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_90` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_95` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_100` }
      ]
    };

    // console.log(params);

    return axios
      .post(`${this.protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        // console.log(res.data.data);
        this.setProjectedData2040(res.data.data);
        this.setProjection(res.data.data);
        this.setIsPLoading(false);
      })
      .catch(err => {
        console.log("Failed to load projection 2040-2069 ", err);
      });
  }

  // Projection 2070-2099 ----------------------------------------------------------
  @observable projectedData2070 = [];

  @action
  setProjectedData2070 = d => {
    this.projectedData2070 = d;
  };

  @action
  loadProjection2070() {
    this.setIsPLoading(true);
    // Subtract 5 months from the current month to get data for the spline function
    const month = Number(format(new Date(), "MM"));

    const params = {
      loc: [this.station.lon, this.station.lat],
      sdate: [2070, 1],
      edate: [2099, month],
      grid: "loca:wMean:rcp45",
      elems: [
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_80` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_85` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_90` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_95` },
        { name: "maxt", interval: [0, 1], reduce: `cnt_gt_100` }
      ]
    };

    // console.log(params);

    return axios
      .post(`${this.protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        // console.log(res.data.data);
        this.setProjectedData2070(res.data.data);
        this.setIsPLoading(false);
      })
      .catch(err => {
        console.log("Failed to load projection 2040-2069 ", err);
      });
  }

  // Common projection's actions and computed properties
  @observable projection = [];

  @action
  setProjection = d => {
    this.projection = d;
  };

  @computed
  get projectedYearlyGrouped() {
    let results = [];
    if (this.projection.length !== 0) {
      const month = format(new Date(), "MM");

      const filtered = this.projection.filter(
        arr => !isAfter(arr[0], `${arr[0].slice(0, 4)}-${month}`)
      );
      // filtered.map(x => console.log(x.slice()));
      const m = Number(month);

      const initial = filtered.slice(0, m);
      // console.log(initial);

      const firstYear = transposeReduce(initial);
      results.push(firstYear);

      const middle = filtered.slice(m, -m);
      // middle.map(x => console.log(x.slice()));
      let tempArray = [];
      for (let i = 0; i < middle.length; i += m) {
        tempArray = middle.slice(i, i + m);
        const middleYear = transposeReduce(tempArray);
        results.push(middleYear);
      }

      const end = filtered.slice(-(m + 1));
      const lastYear = transposeReduce(end);
      results.push(lastYear);
      // results.map(x => console.log(x.slice()));
      return results;
    }
    return results;
  }

  @computed
  get yearlyDaysAboveP() {
    let results = [];
    const x = [80, 85, 90, 95, 100];
    if (this.projectedYearlyGrouped.length !== 0) {
      const month = format(new Date(), "MM");

      const filtered = this.projection.filter(
        arr => !isAfter(arr[0], `${arr[0].slice(0, 4)}-${month}`)
      );
      // filtered.map(x => console.log(x.slice()));

      let tempArray = [];
      filtered.forEach(year => {
        const y = year.slice(1, 6);
        const daysAbove = spline(this.temperature, x, y);
        tempArray.push([year[0], daysAbove]);
        // console.log([year[0], Math.round(Math.abs(daysAbove))]);
      });

      const m = Number(month);
      let oneYear = [];
      for (let i = 0; i < tempArray.length; i += m) {
        oneYear = tempArray.slice(i, i + m);
        results.push(transposeReduce(oneYear));
      }

      // results.map(x => console.log(x.slice()));
      return results;
    }
    return results;
  }

  @computed
  get projectedDays() {
    if (this.yearlyDaysAboveP.length !== 0) {
      return this.yearlyDaysAboveP.map(year => year[1]);
    }
    return [];
  }

  @computed
  get projectedQuantiles() {
    console.log(this.selectedProjection);
    const d = this.projectedDays;
    if (d !== 0) {
      let existingItems = {};
      let quantiles = jStat.quantiles(d, [0, 0.25, 0.5, 0.75, 1]);
      console.log(quantiles);
      if (quantiles.length !== 0) {
        quantiles = quantiles.map(x => Math.round(x));
        console.log(quantiles);
        quantiles.forEach((value, i) => {
          let q;
          if (i === 0) q = 0;
          if (i === 1) q = 0.25;
          if (i === 2) q = 0.5;
          if (i === 3) q = 0.75;
          if (i === 4) q = 1;
          existingItems[value] = q;
        });

        console.log(existingItems);
        console.log(
          Object.values(
            jStat.quantiles(d, Object.values(existingItems))
          ).map(q => Math.round(q))
        );

        return Object.values(
          jStat.quantiles(d, Object.values(existingItems))
        ).map(q => Math.round(q));
      }
    }
    return [];
  }

  @computed
  get projectedIndex() {
    if (this.projectedDays.length !== 0) {
      return index(this.daysAboveThresholdThisYear, this.projectedQuantiles);
    }
    return [];
  }

  @computed
  get projectedArcData() {
    if (this.projectedDays.length !== 0) {
      return arcData(
        this.projectedQuantiles,
        this.daysAboveThresholdThisYear,
        this.temperature,
        "Not Expected"
      );
    }
    return [];
  }

  @computed
  get projectedDataGraph() {
    const values = this.observedData.map(year => Number(year[1]));
    let results = [];
    this.yearlyDaysAboveP.forEach(d => {
      results.push({
        year: format(d[0], "YYYY"),
        "days above": Number(d[1]),
        mean: Math.round(jStat.quantiles(values, [0.5]))
      });
    });
    return results;
  }
}
