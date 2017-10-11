import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd components
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

@inject("store")
@observer
class ObservedGauge extends Component {
  render() {
    return <div>Observed</div>;
  }
}

export default ObservedGauge;
