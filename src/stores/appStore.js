import { observable, action, computed } from "mobx";
import { stations } from "stations";
import format from "date-fns/format";
import addDays from "date-fns/add_days";
import axios from "axios";

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
  @observable observedData;
  @action setObservedData = d => (this.observedData = d);
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
        console.log(res.data.data);
        this.setObservedData(res.data.data);
        // this.setMean();
        this.setIsLoading(false);
      })
      .catch(err => {
        console.log("Failed to load observed data ", err);
      });
  };

  @computed
  get daysAboveLastYear() {
    if (this.observedData) {
      const values = this.observedData.map(year => Number(year[1]));
      return values[values.length - 1];
    }
    return 0;
  }
}
