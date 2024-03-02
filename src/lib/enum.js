const tags = [
  { type: 'dog', name: '拉布拉多' },
  { type: 'dog', name: '黃金獵犬' },
  { type: 'cat', name: '波斯貓' },
  { type: 'cat', name: '金吉拉' },
]
const tagsEnum = tags.map((item) => item.name)

module.exports = {
  tags,
  tagsEnum,
}
