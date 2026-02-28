import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WMO_DESC: Record<number, string> = {
  0: "晴", 1: "大部晴朗", 2: "多云", 3: "阴天",
  45: "雾", 48: "雾凇", 51: "小毛毛雨", 53: "中毛毛雨", 55: "大毛毛雨",
  61: "小雨", 63: "中雨", 65: "大雨", 66: "冻雨", 67: "大冻雨",
  71: "小雪", 73: "中雪", 75: "大雪", 77: "米雪",
  80: "小阵雨", 81: "中阵雨", 82: "大阵雨",
  85: "小阵雪", 86: "大阵雪", 95: "雷暴", 96: "雷暴伴冰雹", 99: "强雷暴伴冰雹",
};

const CITIES: Record<string, { lat: number; lon: number; name: string }> = {
  beijing: { lat: 39.9042, lon: 116.4074, name: "北京" },
  shanghai: { lat: 31.2304, lon: 121.4737, name: "上海" },
  guangzhou: { lat: 23.1291, lon: 113.2644, name: "广州" },
  shenzhen: { lat: 22.5431, lon: 114.0579, name: "深圳" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityKey = searchParams.get("city") || "beijing";
  const city = CITIES[cityKey] || CITIES.beijing;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Shanghai`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error("open-meteo " + res.status);
    const data = await res.json();
    const cur = data?.current;
    if (!cur) throw new Error("no data");

    return NextResponse.json(
      {
        temp: Math.round(cur.temperature_2m).toString(),
        desc: WMO_DESC[cur.weather_code] ?? "未知",
        city: city.name,
        humidity: Math.round(cur.relative_humidity_2m).toString(),
        feelsLike: Math.round(cur.apparent_temperature).toString(),
        windSpeed: Math.round(cur.wind_speed_10m).toString(),
      },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
