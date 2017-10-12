import { observable, action, computed } from "mobx";
import { stations } from "stations";
import format from "date-fns/format";
// import addDays from "date-fns/add_days";
import axios from "axios";
// import spline from "cubic-spline";
import { jStat } from "jStat";
import { reevaluateQuantiles, index } from "utils";

export default class appStore {
  constructor(fetch) {
    this.fetch = fetch;
  }
  // logic-------------------------------------------------------------------------
  @observable protocol = window.location.protocol;
  @observable isLoading = false;
  @action setIsLoading = d => (this.isLoading = d);

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
    return this.observedData.slice(-1).map(arr => Number(arr[1]))[0];
  }
  @computed
  get observedDays() {
    return this.observedData.map(arr => Number(arr[1]));
  }

  @computed
  get observedMinMax() {
    const values = this.observedData.map(arr => Number(arr[1]));
    console.log(values);
    return [Math.min(...values), Math.max(...values)];
  }
  @computed
  get observedQuantiles() {
    if (this.observedDays.length !== 0) {
      const q = jStat.quantiles(this.observedDays, [0, 0.25, 0.5, 0.75, 1]);
      return q.map(n => Math.round(n));
    }
  }
  @computed
  get observedQuantilesNoDuplicates() {
    if (this.observedDays.length !== 0) {
      return reevaluateQuantiles(this.observedQuantiles);
    }
  }
  @computed
  get observedIndex() {
    if (this.observedDays.length !== 0) {
      return index(
        this.daysAboveThresholdThisYear,
        this.observedQuantilesNoDuplicates
      );
    }
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
        // this.setQuantiles(res.data.data);
        this.setIsLoading(false);
      })
      .catch(err => {
        console.log("Failed to load observed data ", err);
      });
  };

  // @computed
  // get observedTimeSeries() {
  //   const values = this.observedData.map(year => Number(year[1]));
  //   let results = [];
  //   this.observedData.forEach(arr => {
  //     results.push({
  //       year: format(arr[0], "YYYY"),
  //       "days above": Number(arr[1])
  //     });
  //   });

  //   return results;
  // }

  // Projection 2040-2069 ----------------------------------------------------------
  // @observable projectedData2040 = [];
  // @action
  // setProjectedData2040 = d => {
  //   // this.projectedData2040.clear();
  //   this.projectedData2040 = d;
  // };

  // @action
  // loadProjection2040() {
  //   // this.setIsPLoading(true);
  //   const params = {
  //     bbox: [
  //       this.station.lon,
  //       this.station.lat + 0.1,
  //       this.station.lon + 0.1,
  //       this.station.lat
  //     ],
  //     // loc: `${this.station.lon}, ${this.station.lat}`,
  //     sdate: [2040, Number(format(new Date(), "MM"))],
  //     edate: [2069, Number(format(new Date(), "MM"))],
  //     grid: "loca:wMean:rcp45",
  //     elems: [
  //       {
  //         name: "maxt",
  //         interval: [0, 1],
  //         reduce: `mean`
  //       }
  //     ]
  //   };

  //   console.log(params);

  //   return axios
  //     .post(`${this.protocol}//grid2.rcc-acis.org/GridData`, params)
  //     .then(res => {
  //       console.log(res.data.data);
  //       // this.setProjectedData2040(res.data.data);
  //       // this.setp2040Mean();
  //       // this.setIsPLoading(false);
  //     })
  //     .catch(err => {
  //       console.log("Failed to load projection 2040-2069 ", err);
  //     });
  // }

  //  PROJECTIONS ONLY! --------------------------------------------------
  // @computed
  // get daysAboveLastYear() {
  //   if (this.observedData) {
  //     const values = this.observedData.slice(-1)[0];
  //     if (values) {
  //       const x = [75, 80, 85, 90, 95, 100];
  //       console.log(x);
  //       const y = values.slice(1, 7).map(n => Number(n));
  //       console.log(y);
  //       const results = spline(this.temperature, x, y);
  //       console.log(
  //         `temp: ${this.temperature}, days above: ${Math.round(results)}`
  //       );
  //       return Math.round(results);
  //     }
  //   }
  // }
}
