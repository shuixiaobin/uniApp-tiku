import {sensorsURL} from './common'

//神策埋点接入
const sa = require('../static/sensorsdata.min.js');
sa.setPara({
	name: 'sensors',
	server_url: sensorsURL
});
const info = uni.getSystemInfoSync();
sa.registerApp({
	business_line: '华图在线',
	platform: '小程序',
	product_name: '题库小程序'
})
sa.init();

export default sa;