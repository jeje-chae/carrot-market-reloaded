export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formater = new Intl.RelativeTimeFormat('ko'); // 며칠 전 이런식으로 포맷을 변경해줌
  return formater.format(diff, 'days');
}

export function formatToWon(price: number): string {
  return price.toLocaleString('ko-KR');
}
