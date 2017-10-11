import { observable, action, computed } from "mobx";
import { stations } from "stations";
import format from "date-fns/format";
import addDays from "date-fns/add_days";
import axios from "axios";
import { quantile } from "simple-statistics";
import spline from "cubic-spline";

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
  get daysAboveThresholdLastYear() {
    return this.observedData.map(year => Number(year[1])).slice(-1);
  }
  @action
  loadObservedData = () => {
    this.setIsLoading(true);
    const seasonStart = format(addDays(new Date(), 1), "MM-DD");

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
          season_start: seasonStart,
          reduce: `cnt_ge_${this.temperature}`
        }
      ]
    };
    // add: 'mcnt',
    // maxmissing: 10

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

  // @observable quantiles = [];

  // @action
  // setQuantiles = data => {
  //   const temps = data.map(arr => arr.slice(1, 7).map(n => Number(n)));
  //   for (var i = 0; i < temps[0].length; i++) {
  //     const quantiles = quantile(temps.map(arr => arr[i]), [
  //       0,
  //       0.25,
  //       0.5,
  //       0.75,
  //       1
  //     ]);
  //     const s = spline(87, [75, 80, 85, 90, 95, 100], [121, 88, 55, 16, 3, 0]);
  //     console.log(Math.round(s));
  //     this.quantiles.push(quantiles);
  //   }
  // };
}
