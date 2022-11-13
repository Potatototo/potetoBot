export function fancyTimeFormat(duration: number): string {
  // Output like "1:01" or "4:03:59" or "123:03:59"
  const hrs: number = ~~(duration / 3600);
  const mins: number = ~~((duration % 3600) / 60);
  const secs: number = ~~duration % 60;

  let ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
