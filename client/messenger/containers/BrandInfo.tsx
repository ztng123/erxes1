import * as React from "react";
import { BrandInfo } from "../components";
import { AppConsumer } from "./AppContext";

const container = () => (
  <AppConsumer>
    {({ getBrand }) => <BrandInfo brand={getBrand()} />}
  </AppConsumer>
);

export default container;
