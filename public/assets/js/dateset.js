// 获取当前日期和时间
const today = new Date();

// 确定可选的最早日期
const earliestDate = new Date(today);
earliestDate.setDate(today.getDate() + 1);

// 将日期转化为特定的格式，用于日期控件的显示
const earliestFormattedDate = earliestDate.toISOString().slice(0, 16);

// 设置默认日期和时间
const defaultDate = new Date(earliestDate);
const defaultFormattedDate = defaultDate.toISOString().slice(0, 16);

// 设置 min 
document.getElementById('expire').setAttribute('min', earliestFormattedDate);
document.getElementById('expire').value = defaultFormattedDate;

// 在日期控件中禁用早于今天的可选日期
document.getElementById('expire').addEventListener('input', function () {
    const inputDate = new Date(document.getElementById('expire').value);
    if (inputDate < earliestDate) {
        document.getElementById('expire').value = defaultFormattedDate;
    }
});
