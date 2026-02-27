"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

// ── Lunar calendar data (1900-2100) ──
const LUNAR_INFO: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520,
];

const S_TERM_INFO: string[] = [
  "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f",
  "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f",
  "b027097bd097c36b0b6fc9274c91aa", "9778397bd19801ec9210c965cc920e", "97b6b97bd19801ec95f8c965cc920f",
  "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd197c36c9210c9274c91aa",
  "97b6b97bd19801ec95f8c965cc920e", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bcf97c3598082c95f8e1cfcc920f",
  "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f",
  "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd07f595b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9210c8dc2", "9778397bd19801ec9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f",
  "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e",
  "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bd07f1487f595b0b0bc920fb0722",
  "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e",
  "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e",
  "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9210c91aa", "97b6b97bd197c36c9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e",
  "97b6b7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36b0b70c9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9210c91aa", "97b6b7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "977837f0e37f149b0723b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c35b0b6fc9210c8dc2",
  "977837f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722",
  "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722",
  "977837f0e37f14998082b0723b06bd", "7f07e7f0e37f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35",
  "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721",
  "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd",
  "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35",
  "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e37f14998083b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14898082b0723b02d5", "7f07e7f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66aa89801e9808297c35", "665f67f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66a449801e9808297c35",
  "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721", "7f0e26665b66a449801e9808297c35", "665f67f0e37f1489801eb072297c35",
  "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722",
];

const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const SOLAR_TERMS = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
const N_STR1 = ["日", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const N_STR2 = ["初", "十", "廿", "卅"];
const N_STR3 = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];

const YI_LIST = ["嫁娶", "祭祀", "祈福", "开光", "出行", "移徙", "入宅", "动土", "安葬", "开市", "交易", "立券", "纳财", "订盟", "纳采", "修造", "上梁", "竖柱", "安门", "安床", "栽种", "破土", "启攒"];
const JI_LIST = ["嫁娶", "开市", "动土", "破土", "安葬", "开仓", "伐木", "作梁", "词讼", "移徙", "远行"];

function lYearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += LUNAR_INFO[y - 1900] & i ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y: number): number {
  return LUNAR_INFO[y - 1900] & 0xf;
}

function leapDays(y: number): number {
  if (leapMonth(y)) {
    return LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29;
  }
  return 0;
}

function monthDays(y: number, m: number): number {
  if (m > 12 || m < 1) return -1;
  return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29;
}

function getTerm(y: number, n: number): number {
  if (y < 1900 || y > 2100 || n < 1 || n > 24) return -1;
  const table = S_TERM_INFO[y - 1900];
  const info = [
    parseInt("0x" + table.substr(0, 5)).toString(),
    parseInt("0x" + table.substr(5, 5)).toString(),
    parseInt("0x" + table.substr(10, 5)).toString(),
    parseInt("0x" + table.substr(15, 5)).toString(),
    parseInt("0x" + table.substr(20, 5)).toString(),
    parseInt("0x" + table.substr(25, 5)).toString(),
  ];
  const calday = [
    info[0].substr(0, 1), info[0].substr(1, 2), info[0].substr(3, 1), info[0].substr(4, 2),
    info[1].substr(0, 1), info[1].substr(1, 2), info[1].substr(3, 1), info[1].substr(4, 2),
    info[2].substr(0, 1), info[2].substr(1, 2), info[2].substr(3, 1), info[2].substr(4, 2),
    info[3].substr(0, 1), info[3].substr(1, 2), info[3].substr(3, 1), info[3].substr(4, 2),
    info[4].substr(0, 1), info[4].substr(1, 2), info[4].substr(3, 1), info[4].substr(4, 2),
    info[5].substr(0, 1), info[5].substr(1, 2), info[5].substr(3, 1), info[5].substr(4, 2),
  ];
  return parseInt(calday[n - 1], 10);
}

function toChinaDay(d: number): string {
  if (d === 10) return "初十";
  if (d === 20) return "二十";
  if (d === 30) return "三十";
  return N_STR2[Math.floor(d / 10)] + N_STR1[d % 10];
}

function toChinaMonth(m: number): string {
  if (m > 12 || m < 1) return "";
  return N_STR3[m - 1] + "月";
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  monthName: string;
  dayName: string;
  animal: string;
  ganZhiYear: string;
  solarTerm: string | null;
}

function getLunarDate(year: number, month: number, day: number): LunarDate | null {
  if (year < 1900 || year > 2100 || (year === 1900 && month === 1 && day < 31)) return null;
  const objDate = new Date(year, month - 1, day);
  let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;
  let i = 1900;
  let temp = 0;
  for (; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  const lYear = i;
  const leap = leapMonth(i);
  let isLeap = false;
  let m = 1;
  for (; m < 13 && offset > 0; m++) {
    if (leap > 0 && m === leap + 1 && !isLeap) {
      m--;
      isLeap = true;
      temp = leapDays(lYear);
    } else {
      temp = monthDays(lYear, m);
    }
    if (isLeap && m === leap + 1) isLeap = false;
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && m === leap + 1) {
    isLeap = !isLeap;
    if (!isLeap) m--;
  }
  if (offset < 0) {
    offset += temp;
    m--;
  }
  const lMonth = m;
  const lDay = offset + 1;
  const ganKey = (lYear - 3) % 10;
  const zhiKey = (lYear - 3) % 12;
  const ganZhiYear = GAN[(ganKey === 0 ? 10 : ganKey) - 1] + ZHI[(zhiKey === 0 ? 12 : zhiKey) - 1];
  const animal = ZODIAC[(lYear - 4) % 12];
  const firstNode = getTerm(year, month * 2 - 1);
  const secondNode = getTerm(year, month * 2);
  let solarTerm: string | null = null;
  if (firstNode === day) solarTerm = SOLAR_TERMS[month * 2 - 2];
  if (secondNode === day) solarTerm = SOLAR_TERMS[month * 2 - 1];
  return {
    year: lYear,
    month: lMonth,
    day: lDay,
    isLeap,
    monthName: (isLeap ? "闰" : "") + toChinaMonth(lMonth),
    dayName: toChinaDay(lDay),
    animal,
    ganZhiYear,
    solarTerm,
  };
}

function getSolarTermForDate(year: number, month: number, day: number): string | null {
  const t1 = getTerm(year, month * 2 - 1);
  const t2 = getTerm(year, month * 2);
  if (t1 === day) return SOLAR_TERMS[month * 2 - 2];
  if (t2 === day) return SOLAR_TERMS[month * 2 - 1];
  return null;
}

function getYiJi(year: number, month: number, day: number): { yi: string[]; ji: string[] } {
  const seed = year * 10000 + month * 100 + day;
  const hash = (x: number) => ((seed * 31 + x * 17) % 1000) / 1000;
  const yiCount = Math.min(4 + Math.floor(hash(1) * 3), YI_LIST.length);
  const jiCount = Math.min(2 + Math.floor(hash(2) * 2), JI_LIST.length);
  const yiOrder = YI_LIST.map((_, i) => i).sort((a, b) => hash(a) - hash(b));
  const jiOrder = JI_LIST.map((_, i) => i).sort((a, b) => hash(a + 100) - hash(b + 100));
  return {
    yi: yiOrder.slice(0, yiCount).map((i) => YI_LIST[i]),
    ji: jiOrder.slice(0, jiCount).map((i) => JI_LIST[i]),
  };
}

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function getChineseHoliday(year: number, month: number, day: number): string | null {
  if (month === 1 && day === 1) return "元旦";
  if (month === 5 && day === 1) return "劳动节";
  if (month === 10 && day === 1) return "国庆节";
  const lunar = getLunarDate(year, month, day);
  if (!lunar) return null;
  if (lunar.month === 1 && lunar.day === 1 && !lunar.isLeap) return "春节";
  if (lunar.month === 5 && lunar.day === 5 && !lunar.isLeap) return "端午";
  if (lunar.month === 8 && lunar.day === 15 && !lunar.isLeap) return "中秋";
  if (month === 4 && day === getTerm(year, 7)) return "清明";
  return null;
}

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<{ year: number; month: number; day: number } | null>(null);

  const firstDay = new Date(viewYear, viewMonth - 1, 1);
  const lastDay = new Date(viewYear, viewMonth, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const calendarDays = useMemo(() => {
    const days: { date: number; isCurrent: boolean; isToday: boolean; isWeekend: boolean; isSelected: boolean }[] = [];
    for (let i = 0; i < startPad; i++) {
      days.push({ date: 0, isCurrent: false, isToday: false, isWeekend: false, isSelected: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(viewYear, viewMonth - 1, d);
      const w = dt.getDay();
      days.push({
        date: d,
        isCurrent: true,
        isToday: viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1 && d === today.getDate(),
        isWeekend: w === 0 || w === 6,
        isSelected: selected !== null && selected.year === viewYear && selected.month === viewMonth && selected.day === d,
      });
    }
    return days;
  }, [viewYear, viewMonth, daysInMonth, startPad, selected, today]);

  const yearGanZhi = useMemo(() => {
    const y = viewYear;
    const ganKey = (y - 3) % 10;
    const zhiKey = (y - 3) % 12;
    return GAN[(ganKey === 0 ? 10 : ganKey) - 1] + ZHI[(zhiKey === 0 ? 12 : zhiKey) - 1];
  }, [viewYear]);

  const yearZodiac = useMemo(() => ZODIAC[(viewYear - 4) % 12], [viewYear]);

  const solarTermsInMonth = useMemo(() => {
    const t1 = getTerm(viewYear, viewMonth * 2 - 1);
    const t2 = getTerm(viewYear, viewMonth * 2);
    return [
      { day: t1, name: SOLAR_TERMS[viewMonth * 2 - 2] },
      { day: t2, name: SOLAR_TERMS[viewMonth * 2 - 1] },
    ];
  }, [viewYear, viewMonth]);

  const detail = useMemo(() => {
    if (!selected) return null;
    const lunar = getLunarDate(selected.year, selected.month, selected.day);
    const dt = new Date(selected.year, selected.month - 1, selected.day);
    const { yi, ji } = getYiJi(selected.year, selected.month, selected.day);
    const holiday = getChineseHoliday(selected.year, selected.month, selected.day);
    const solarTerm = getSolarTermForDate(selected.year, selected.month, selected.day);
    return {
      solar: `${selected.year}年${selected.month}月${selected.day}日`,
      lunar: lunar ? `${lunar.monthName}${lunar.dayName}` : "-",
      weekday: WEEKDAYS[dt.getDay()],
      zodiac: lunar?.animal ?? "-",
      ganZhi: lunar?.ganZhiYear ?? "-",
      solarTerm: solarTerm ?? (lunar?.solarTerm ?? null),
      holiday,
      yi,
      ji,
    };
  }, [selected]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">万年历 / 黄历</h1>
      <p className="page-subtitle">公历农历对照，二十四节气，老黄历宜忌查询</p>

      <div className="card mt-6 rounded-xl p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (viewMonth === 1) {
                  setViewYear((y) => y - 1);
                  setViewMonth(12);
                } else setViewMonth((m) => m - 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] transition-colors hover:border-[var(--primary)]"
            >
              ‹
            </button>
            <span className="min-w-[140px] text-center font-semibold">
              {viewYear}年{viewMonth}月
            </span>
            <button
              onClick={() => {
                if (viewMonth === 12) {
                  setViewYear((y) => y + 1);
                  setViewMonth(1);
                } else setViewMonth((m) => m + 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] transition-colors hover:border-[var(--primary)]"
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
              className="input rounded-lg px-3 py-2 text-sm"
            >
              {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
              className="input rounded-lg px-3 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-4 text-sm text-[var(--muted)]">
          <span>{yearGanZhi}年</span>
          <span>生肖：{yearZodiac}</span>
          <span>
            节气：{solarTermsInMonth[0].name}({solarTermsInMonth[0].day}日) / {solarTermsInMonth[1].name}({solarTermsInMonth[1].day}日)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
            <div key={d} className="py-2 font-medium text-[var(--muted)]">
              {d}
            </div>
          ))}
          {calendarDays.map((cell, idx) => {
            const lunar = cell.date && cell.isCurrent ? getLunarDate(viewYear, viewMonth, cell.date) : null;
            const solarTerm = cell.date && cell.isCurrent ? getSolarTermForDate(viewYear, viewMonth, cell.date) : null;
            const holiday = cell.date && cell.isCurrent ? getChineseHoliday(viewYear, viewMonth, cell.date) : null;
            return (
              <button
                key={idx}
                onClick={() => cell.isCurrent && setSelected({ year: viewYear, month: viewMonth, day: cell.date })}
                className={`min-h-[72px] rounded-lg border p-1.5 text-left transition-colors ${
                  !cell.isCurrent
                    ? "border-transparent bg-transparent text-[var(--muted)] opacity-50"
                    : cell.isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : cell.isToday
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-transparent hover:bg-[var(--card-border)]/50"
                }`}
              >
                {cell.date > 0 && (
                  <>
                    <div className={`text-base font-medium ${cell.isWeekend && !cell.isToday && !cell.isSelected ? "text-[var(--muted)]" : ""}`}>
                      {cell.date}
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
                      {lunar?.dayName}
                    </div>
                    {(solarTerm || holiday) && (
                      <div className="mt-0.5 truncate text-[10px] text-amber-600 dark:text-amber-400">
                        {solarTerm || holiday}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {detail && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">日期详情</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p><span className="text-[var(--muted)]">公历：</span>{detail.solar}</p>
              <p><span className="text-[var(--muted)]">农历：</span>{detail.lunar}</p>
              <p><span className="text-[var(--muted)]">星期：</span>{detail.weekday}</p>
              <p><span className="text-[var(--muted)]">生肖：</span>{detail.zodiac}</p>
              <p><span className="text-[var(--muted)]">干支：</span>{detail.ganZhi}</p>
              {detail.solarTerm && <p><span className="text-[var(--muted)]">节气：</span>{detail.solarTerm}</p>}
              {detail.holiday && <p><span className="text-[var(--muted)]">节日：</span><span className="text-amber-600 dark:text-amber-400">{detail.holiday}</span></p>}
            </div>
            <div className="space-y-2">
              <p><span className="text-[var(--muted)]">宜：</span><span className="text-green-600 dark:text-green-400">{detail.yi.join("、")}</span></p>
              <p><span className="text-[var(--muted)]">忌：</span><span className="text-red-600 dark:text-red-400">{detail.ji.join("、")}</span></p>
            </div>
          </div>
        </div>
      )}
    </ToolPageWrapper>
  );
}
