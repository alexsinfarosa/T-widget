import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class Test extends Component {
  render() {
    console.log(this.props.store.app.isLoading);
    return <div>ciccio</div>;
  }
}

export default Test;
