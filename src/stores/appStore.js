import { observable, action, computed } from "mobx";
import { stations } from "stations";
import format from "date-fns/format";
import axios from "axios";
import spline from "cubic-spline";
import { jStat } from "jStat";
import getDaysInMonth from "date-fns/get_days_in_month";
import getDayOfYear from "date-fns/get_day_of_year";
import map from "lodash.map";

import { index, arcData, determineQuantiles } from "utils";

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
    if (this.observedData.length !== 0) {
      return this.observedData.slice(-1).map(arr => Number(arr[1]))[0];
    }
    return [];
  }

  @computed
  get observedDays() {
    if (this.observedData.length !== 0) {
      return this.observedData.map(arr => Number(arr[1]));
    }
    return [];
  }

  @computed
  get observedMean() {
    if (this.observedData.length !== 0) {
      return jStat.quantiles(this.observedDays, [0.5])[0];
    }
    return 0;
  }

  @computed
  get observedQuantiles() {
    console.log("Observed");
    if (this.observedDays.length !== 0) {
      return determineQuantiles(this.observedDays);
    }
    return [];
  }

  @computed
  get observedQuantilesValues() {
    if (this.observedQuantiles.length !== 0) {
      return Object.values(this.observedQuantiles);
    }
    return [];
  }

  @computed
  get observedIndex() {
    if (this.observedQuantiles.length !== 0) {
      return index(
        this.daysAboveThresholdThisYear,
        this.observedQuantilesValues
      );
    }
    return [];
  }

  @computed
  get observedArcData() {
    if (this.observedQuantiles.length !== 0) {
      return arcData(
        this.observedQuantiles,
        this.daysAboveThresholdThisYear,
        this.temperature,
        "New Record"
      ); // fix this
    }
    return [];
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
  @action
  setHighEmission = d => {
    this.highEmission = d;
    this.setProjection();
  };

  @action
  loadProjection2040() {
    this.setIsPLoading(true);
    // Subtract 5 months from the current month to get data for the spline function

    const params = {
      loc: [this.station.lon, this.station.lat],
      sdate: [2040, 1],
      edate: [2069, 12],
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
        if (this.selectedProjection === "Projection 2040-2069") {
          this.setProjection(res.data.data);
        }
        this.setIsPLoading(false);
      })
      .catch(err => {
        console.log("Failed to load projection 2040-2069 ", err);
      });
  }

  // Projection 2070-2099 ----------------------------------------------------------

  @action
  loadProjection2070() {
    this.setIsPLoading(true);
    // Subtract 5 months from the current month to get data for the spline function

    const params = {
      loc: [this.station.lon, this.station.lat],
      sdate: [2070, 1],
      edate: [2099, 12],
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
        if (this.selectedProjection === "Projection 2070-2099") {
          this.setProjection(res.data.data);
        }
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

  @observable month = Number(format(new Date(), "MM"));
  @computed
  get daysAbovePerYear() {
    const mm = 12;

    let splinedTemp = [];
    const x = [80, 85, 90, 95, 100];
    this.projection.forEach(year => {
      const y = year.slice(1, 6);
      const daysAbove = spline(this.temperature, x, y);
      splinedTemp.push([year[0], daysAbove]);
    });
    // splinedTemp.slice(0, mm).map(x => console.log(x.slice()));

    const splinedTempLastMonths = splinedTemp.map(
      month => month.slice(0, 1)[0]
    );
    // splinedTempLastMonths.slice(0, mm).map(x => console.log(x));

    const splinedTempValues = splinedTemp.map(
      month => month.slice(1, month.length)[0]
    );
    // splinedTempValues.slice(0, mm).map(x => console.log(x));

    const daysInEachMonth = splinedTemp.map(month => getDaysInMonth(month[0]));
    // daysInEachMonth.slice(0, mm).map(x => console.log(x));

    const dayOfYear = getDayOfYear(new Date());
    let results = [];
    for (let i = 0; i < splinedTemp.length; i += mm) {
      const date = splinedTempLastMonths.slice(i, i + mm).slice(-1)[0];
      const year = date.split("-")[0];
      const currentMonth = `${year}-${this.month}`;
      // console.log(currentMonth);

      let vCumulative = 0;
      const values = splinedTempValues.slice(i, i + mm);
      const valuesR = map(values, n => {
        vCumulative += n;
        return vCumulative;
      });
      // console.log(valuesR);

      let dCumulative = 0;
      const days = daysInEachMonth.slice(i, i + mm);
      const daysR = map(days, d => {
        dCumulative += d;
        return dCumulative;
      });
      // console.log(daysR);
      const daysAbove = spline(dayOfYear, daysR, valuesR);
      // console.log(dayOfYear, [currentMonth, daysAbove]);
      results.push([currentMonth, daysAbove]);
    }
    return results;
  }

  @computed
  get projectedDays() {
    if (this.daysAbovePerYear.length !== 0) {
      return this.daysAbovePerYear.map(year => year.slice(1, year.length)[0]);
    }
    return [];
  }

  @computed
  get projectedQuantiles() {
    console.log(this.selectedProjection, `rpc:${this.highEmission}`);
    if (this.projectedDays.length !== 0) {
      return determineQuantiles(this.projectedDays);
    }
    return [];
  }

  @computed
  get projectedQuantilesValues() {
    if (this.projectedQuantiles.length !== 0) {
      return Object.values(this.projectedQuantiles);
    }
    return [];
  }

  @computed
  get projectedIndex() {
    if (this.projectedQuantiles.length !== 0) {
      return index(
        this.daysAboveThresholdThisYear,
        this.projectedQuantilesValues
      );
    }
    return [];
  }

  @computed
  get projectedArcData() {
    if (this.projectedQuantiles.length !== 0) {
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
    this.daysAbovePerYear.forEach(d => {
      results.push({
        year: format(d[0], "YYYY"),
        "days above": Math.round(Number(d[1])),
        mean: Math.round(jStat.quantiles(values, [0.5]))
      });
    });
    return results;
  }
}
