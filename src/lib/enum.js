const tags = [
  { type: '狗狗', name: '拉布拉多' },
  { type: '狗狗', name: '黃金獵犬' },
  { type: '狗狗', name: '柯基犬' },
  { type: '狗狗', name: '哈士奇' },
  { type: '狗狗', name: '臘腸犬' },
  { type: '狗狗', name: '柴犬' },
  { type: '狗狗', name: '馬爾濟斯' },
  { type: '狗狗', name: '狐狸犬' },
  { type: '狗狗', name: '貴賓犬' },
  { type: '狗狗', name: '雪納瑞' },
  { type: '狗狗', name: '吉娃娃' },
  { type: '狗狗', name: '博美犬' },
  { type: '狗狗', name: '牧羊犬' },
  { type: '狗狗', name: '鬥牛犬' },
  { type: '狗狗', name: '杜賓犬' },
  { type: '狗狗', name: '約克夏' },
  { type: '狗狗', name: '比熊犬' },
  { type: '狗狗', name: '西施犬' },
  { type: '狗狗', name: '敖犬' },
  { type: '狗狗', name: '米克斯犬' },
  { type: '貓貓', name: '波斯貓' },
  { type: '貓貓', name: '英國短毛貓' },
  { type: '貓貓', name: '美國短毛貓' },
  { type: '貓貓', name: '緬因貓' },
  { type: '貓貓', name: '豹貓' },
  { type: '貓貓', name: '暹羅貓' },
  { type: '貓貓', name: '俄羅斯藍貓' },
  { type: '貓貓', name: '布偶貓' },
  { type: '貓貓', name: '摺耳貓' },
  { type: '貓貓', name: '米克斯貓' },
]
const tagsEnum = tags.map((item) => item.name)

// 積分詳情
const reasons = {
  1: '發文',
  2: '按讚',
  3: '留言',
  4: '訂單紅利',
  5: '訂單折抵',
  6: '捐贈',
}

module.exports = {
  tags,
  tagsEnum,
  reasons,
}
