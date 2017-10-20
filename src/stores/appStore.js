import { observable, action, computed } from "mobx";
import { stations } from "stations";
import format from "date-fns/format";
import differenceInCalendarMonths from "date-fns/difference_in_calendar_months";
import axios from "axios";
import spline from "cubic-spline";
import { jStat } from "jStat";
import isAfter from "date-fns/is_after";

import { reevaluateQuantiles, index, arcData, transposeReduce } from "utils";

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
  @action setProjection = d => (this.selectedProjection = d);

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
    if (this.observedData.length > 0) {
      return this.observedData.slice(-1).map(arr => Number(arr[1]))[0];
    }
    return [];
  }

  @computed
  get observedDays() {
    if (this.observedData.length > 0) {
      return this.observedData.map(arr => Number(arr[1]));
    }
    return [];
  }

  @computed
  get observedQuantiles() {
    if (this.observedDays.length !== 0) {
      const q = jStat.quantiles(this.observedDays, [0, 0.25, 0.5, 0.75, 1]);
      return q.map(n => Math.round(n));
    }
    return [];
  }

  @computed
  get observedQuantilesNoDuplicates() {
    if (this.observedDays.length !== 0) {
      return reevaluateQuantiles(this.observedQuantiles);
    }
    return [];
  }

  @computed
  get observedIndex() {
    if (this.observedDays.length !== 0) {
      return index(
        this.daysAboveThresholdThisYear,
        this.observedQuantilesNoDuplicates
      );
    }
    return [];
  }

  @computed
  get observedArcData() {
    return arcData(
      this.observedQuantilesNoDuplicates,
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

  // Projection 2040-2069 ----------------------------------------------------------
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
        this.setProjectedData2040(res.data.data);
        this.setIsPLoading(false);
      })
      .catch(err => {
        console.log("Failed to load projection 2040-2069 ", err);
      });
  }

  @computed
  get projected2040YearlyGrouped() {
    const month = format(new Date(), "MM");
    // const year = d[0].slice(0, 4);
    const monthDiff = Math.abs(
      differenceInCalendarMonths("2040-01", `2040-${month}`)
    );

    let results = [];
    if (this.projectedData2040.length !== 0) {
      const filtered = this.projectedData2040.filter(
        arr => !isAfter(arr[0], `${arr[0].slice(0, 4)}-${month}`)
      );
      // filtered.map(x => console.log(x.slice()));
      const initial = filtered.slice(0, monthDiff + 1);

      const firstYear = transposeReduce(initial);
      results.push(firstYear);

      const middle = filtered.slice(monthDiff + 1, -(monthDiff + 2));
      let tempArray = [];
      for (let i = 0; i < middle.length; i += 12) {
        tempArray = middle.slice(i, i + 12);
        const middleYear = transposeReduce(tempArray);
        results.push(middleYear);
      }

      const end = filtered.slice(-(monthDiff + 2));
      const lastYear = transposeReduce(end);
      results.push(lastYear);
      return results;
    }
    return results;
  }

  @computed
  get yearlyDaysAboveP2040() {
    let results = [];
    const x = [80, 85, 90, 95, 100];
    if (this.projected2040YearlyGrouped.length !== 0) {
      this.projected2040YearlyGrouped.forEach(year => {
        const y = year.slice(1, 6);
        const daysAbove = spline(this.temperature, x, y);
        results.push([year[0], Math.round(Math.abs(daysAbove))]);
        // console.log([year[0], Math.round(Math.abs(daysAbove))]);
      });
      return results;
    }
    return results;
  }

  @computed
  get projected2040Days() {
    if (this.yearlyDaysAboveP2040.length !== 0) {
      return this.yearlyDaysAboveP2040.map(year => year[1]);
    }
    return [];
  }

  @computed
  get projected2040Quantiles() {
    if (this.projected2040Days.length !== 0) {
      const q = jStat.quantiles(this.projected2040Days, [
        0,
        0.25,
        0.5,
        0.75,
        1
      ]);
      return q.map(n => Math.round(n));
    }
    return [];
  }

  @computed
  get projected2040QuantilesNoDuplicates() {
    if (this.projected2040Days.length !== 0) {
      return reevaluateQuantiles(this.projected2040Quantiles);
    }
    return [];
  }

  @computed
  get projected2040Index() {
    if (this.projected2040Days.length !== 0) {
      return index(
        this.daysAboveThresholdThisYear,
        this.projected2040QuantilesNoDuplicates
      );
    }
    return [];
  }

  @computed
  get projected2040ArcData() {
    if (this.projected2040Days.length !== 0) {
      return arcData(
        this.projected2040QuantilesNoDuplicates,
        this.daysAboveThresholdThisYear,
        this.temperature,
        "Not Expected"
      ); // fix this
    }
    return [];
  }

  @computed
  get projected2040DataGraph() {
    const values = this.yearlyDaysAboveP2040.map(year => Number(year[1]));
    let results = [];
    this.yearlyDaysAboveP2040.forEach(d => {
      results.push({
        year: format(d[0], "YYYY"),
        "days above": Number(d[1]),
        mean: Math.round(jStat.quantiles(values, [0.5]))
      });
    });
    return results;
  }
}
