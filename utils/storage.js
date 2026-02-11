/**
 * 格式化时间戳
 */
function formatTime(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hour}:${minute}`
}

/**
 * 保存到历史记录
 */
function saveToHistory(record) {
  let historyList = wx.getStorageSync('historyList') || []
  historyList.unshift({
    ...record,
    id: Date.now(),
    createTime: formatTime(Date.now())
  })
  wx.setStorageSync('historyList', historyList)
}

/**
 * 获取历史记录
 */
function getHistory() {
  return wx.getStorageSync('historyList') || []
}

/**
 * 删除历史记录
 */
function deleteHistory(id) {
  let historyList = getHistory()
  historyList = historyList.filter(item => item.id !== id)
  wx.setStorageSync('historyList', historyList)
}

/**
 * 清空历史记录
 */
function clearHistory() {
  wx.setStorageSync('historyList', [])
}

module.exports = {
  formatTime,
  saveToHistory,
  getHistory,
  deleteHistory,
  clearHistory
}
