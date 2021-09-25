import * as d3 from 'd3'; 
import {JSDOM} from "jsdom";

const jsdom = new JSDOM(html);
const svg = d3.select(jsdom.window.document.body).append("svg");