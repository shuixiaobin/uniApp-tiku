import {getReport, getQuestions,getMockDetail,getMockQuestions} from "../../utils/api";
import newFormater from '@/utils/newFormater'
//import { questionTypes } from '@/utils/newFormater'
import Vue from 'vue'

function translateHTML (html) {
	const imgReg = /<img(.*?)(?:\/>|>)/g
	const styleReg = /style="([^"]*)"/
	if(!html)return ''
	return html.replace(imgReg, (str, attrs) => {
		if (styleReg.test(attrs)) {
			return `<img ${attrs.replace(styleReg, `style="max-width: 100%;height: auto;"`)}/>`
		} else {
			return `<img${attrs} style="max-width: 100%;height:auto;"/>`
		}
	})
}
const supportQuestionType = [98,99, 100, 101, 109]


export default {
	namespaced: true,
	state: {
		cardId: '',	  //答题卡ID
		paperId: '',  //试卷ID
		qtList: null,	  // 解析题目列表
		isAll: null,
		paper: null,
		answers: null, //用户答案
		y: 200,
		currentIndex: 0
	},
	mutations: {
		setQtList(state, {arr, list}){ //精准估分
			//arr是解析,list是答题卡
			var allList=[];
			console.log(arr)
			allList= arr.map((item, index) => {
				if (item.type in newFormater) //看看是不是新题型
					return newFormater[item.type]({...item,...list[index]}, index)
					
/* 				if(item.type == 106){//主观题
					return {
						...list[index],
						stem: translateHTML(item.stem),
						choices: [],
						material:item.material,
						id: item.id,
						type: item.type,
						answer: item.referAnalysis,
						index,
						disabled: !supportQuestionType.includes(item.type),
						teachType: item.teachType,
						analysis: translateHTML(item.answerRequire),
						extend: translateHTML(item.extend),
						pointsName: item.pointsName,
						from: item.from,	//来源
						meta: {},  //正确率
						cantAnswer: !supportQuestionType.includes(item.type)
					}
				} */
					return {
						...list[index],
						stem: translateHTML(item.stem),
						choices: item.choices  ? item.choices.map(translateHTML) : [],
						material: translateHTML(item.material || ''),
						id: item.id,
						type: item.type,
						answer: item.answer,
						index,
						disabled: !supportQuestionType.includes(item.type),
						teachType: item.teachType,
						analysis: translateHTML(item.analysis),
						extend: translateHTML(item.extend),
						pointsName: item.pointsName,
						from: item.from,	//来源
						meta: item.meta,  //正确率
						cantAnswer: !supportQuestionType.includes(item.type)
					}
			});

			if(!state.isAll ){
				allList= allList.filter((item) => {
					return item.correct===2 || item.correct===4
				})
			}
			state.qtList = allList;

		},

		setMockList(state, {arr, list}){ //模考大赛
			var allList=[];
			allList= arr.map((item, index) => {
				var material=translateHTML(item.material);
				if(item.materialList && Object.prototype.toString.call(item.materialList) === "[object Null]"){
						material = translateHTML(  item.materialList|| '')
				}
				if(item.type == 106){//主观题
					//console.log(item)
					return {
						...list[index],
						stem: translateHTML(item.stem),
						choices: [],
						material:translateHTML(item.material),
						id: item.id,
						type: item.type,
						answer: item.referAnalysis,
						index,
						disabled: !supportQuestionType.includes(item.type),
						teachType: item.teachType,
						analysis: translateHTML(item.answerRequire),
						extend: translateHTML(item.extend),
						pointsName: item.pointsName,
						from: item.source,	//来源
						meta: {},  //正确率
						cantAnswer: !supportQuestionType.includes(item.type)
					}
				}else{
					return {
						...list[index],
						stem: translateHTML(item.stem),
						choices: item.choiceList ? item.choiceList.map(translateHTML) : [],
						material: material,
						id: item.id,
						type: item.type,
						answer: item.answer,
						index,
						disabled: !supportQuestionType.includes(item.type),
						teachType: item.teachType,
						analysis: translateHTML(item.analysis),
						extend: translateHTML(item.extend),
						pointsName: item.pointsName,
						from: item.source,	//来源
						meta: item.meta,  //正确率
						cantAnswer: !supportQuestionType.includes(item.type)
					}
				}
			});

			if(!state.isAll ){//只看错题
				allList= allList.filter((item) => {
					return item.correct===2
				})
			}
			state.qtList = allList;
		},
		init(state, {cardId, paperId, isAll, paper}){
			state.cardId = cardId;
			state.paperId = paperId;
			state.isAll = isAll;
			state.paper = paper;
		},
		setAnswers: (state, answers) => (state.answers = answers),
		setY: (state, y) => (state.y = y),
		setCurrentIndex: (state, index) => (state.currentIndex = index),
	},
	actions: {
		getReport({commit, state, dispatch}, {cardId, isAll}){ //精准估分
			// carId相同就不处理
			if(cardId === state.cardId && state.isAll===isAll)return
			let param = {id: cardId}
			getReport(param).then(res => {
				commit('init',{
					cardId,
					paperId: res.paper.id,
					isAll,
					paper: res.paper
				});
				let answers = res.answers;
				let arr=[];
				let userAry=[];
				if (res.subAnswers) { //新题型的用户答案
					userAry=res.subAnswers.map((item, index) => {
						const c = res.corrects[index]
						if (c === 0 || c === 3) {
							return ''
						}
						return item
					});
					commit('setAnswers',userAry )
				} else {
					userAry=res.answers;
					commit('setAnswers', userAry)
				}

				arr = res.paper.questions.map((item, index) => {
					return {
						id: item,
						correct: res.corrects[index],
						uAnswer: userAry[index],
						time: res.times[index]
					}
				});

/* 				if(!isAll){ //只看错题
					answers = answers.filter((item,index) => {
						return arr[index].correct===2
					})
					arr = arr.filter((item) => {
						return item.correct===2
					})
				} */
				dispatch('setGufenList', arr)
			})
		},

		getMockReport({commit, state, dispatch}, {cardId, isAll}){ //模考大赛
			// carId相同就不处理
			if(cardId === state.cardId && state.isAll===isAll)return
			let param = {id: cardId}
			getMockDetail(param).then(res => {
				commit('init',{
					cardId,
					paperId: res.paper.id,
					isAll,
					paper: res.paper
				});
				let answers = res.answers;
				commit('setAnswers', answers)//用户答案
				let arr=[];
				arr = answers.map((item, index) => {
						return {
							id: res.paper.questions[index],
							correct: res.corrects[index],
							uAnswer: res.answers[index],
							time: res.times[index]
						}
				});
				
				getMockQuestions(res.idStr).then(res => {
					let answersArr = res.map((item, index) => {
						return item.answer?item.answer+'':''
					});
					commit('setMockList',{arr:res,list:arr})//题目解析
				})
			})
		},
		//获取试题
		setGufenList({commit, state}, arr){
			let str = '';
			let list =arr;
			list.forEach(item => {
				str += item.id + ','
			})
			getQuestions(state.paperId, str).then(res => {
					commit('setQtList',{arr:res.data, list:list})
			})
		}
	}
}