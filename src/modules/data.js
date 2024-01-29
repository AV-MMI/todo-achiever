import * as logic from './logic.js'
export { storage, userSetting, extractFromLocal, populateStorage }

const storage = {
	objs: {title: 'objs',
			trash: {title: 'trash', type: 'dir'},
	},
	counter: 0,

	getObj([prop, value], level=this.objs){
		if(Object.keys(level).length > 0 && prop && value){
			if(prop == 'title' && value == ''){
				return this.objs;
			}
			// checking items at this level and look for a match
			for(let item in level){
				if(level[item][prop] ==  value){
					return level[item];
				}
			}

			// no match made at this level
			for(let item in level){
				if(level[item]['type'] == 'project' ){
					return this.getObj([prop, value], level[item]);
				}
			}

			// no match made at all levels
		} else {
			return false;
		}
	},


	getObjs([prop, value], level=this.objs, arr=[]){
		if(Object.keys(level).length > 0){
			// checking items at this level and look for a match
			for(let item in level){
				if(level[item][prop] ==  value){
					arr.push(level[item]);
				}
			}

			// no match made at this level
			for(let item in level){
				if(level[item]['type'] == 'project'){
					return this.getObjs([prop, value], level[item], arr);
				}
			}

			// no match made at all levels
			return arr;
		} else {
			return arr;
		}
	},

	uniqueAtLevel(obj){
		// get obj level
		let projectHost = this.getObj(['title', obj.project]) || this.objs;

		// loop through its elements to check if there is a title conflic
		for(let item in projectHost){
			if(projectHost[item]['title'] == obj.title){
				return false;
			}
		}

		return true;
	},

	addObj(obj={}){
		if(this.uniqueAtLevel(obj) && obj.type){
			// identify the obj with an unique id prop.
			if(!obj.id){
				obj.id = `${obj.type[0]}${this.counter}`;
				this.counter++;
			}

			// project == '': main || non-project: unassigned
			if(obj.project == ''){
				if(obj.type == 'project'){
					this.objs[obj.title] = obj;
				}
				else {
					this.objs[obj.id] = obj;
				}

			}

			// project == !'': sub || non-project: assigned
			else {
				// project exist
				if(this.getObj(['title', obj.project])){
					let projectHost = this.getObj(['title', obj.project]);
					if(obj.type == 'project'){
						projectHost[obj.title] = obj;
						return;
					}
					else {
						projectHost[obj.id] = obj;
						return;
					}
					return;
				}

				// project doesnot exist
				else {
					let projectHost = logic.createItem({'title': obj.project, 'project': '', 'done': false, 'type': 'project'});
					this.addObj(projectHost);
					this.addObj(obj);
				}
			}
		} else {
			return;
		}
	},

	removeObj(obj={}, storage=this.objs){
		// main project, or unassigned task.
		if(obj.project == ''){
			if(obj.type == 'project'){
				delete storage[obj.title];
			}
			else {
				delete storage[obj.id];
			}
		}
		// inside a project
		else {
			let projectHost = this.getObj(['title', obj.project]);
			if(obj.type == 'project'){
				delete projectHost[obj.title];
			}
			else {
				delete projectHost[obj.id];
			}
		}
		return;
	},


}

const userSetting = {
	delete: {
		partial: true,
		complete: false,
	},
	storage: {
		none: false,
		local: true,
	},

	setDelete(value){
		if(value == 'partial'){
			this.delete.complete = false;
			this.delete.partial = true;
		} else {
			this.delete.complete = true;
			this.delete.partial = false;
		}
	},

	getDeleteVal(){
		for(let prop in userSetting['delete']){
			if(userSetting['delete'][prop]){
				return prop;
			}

		}

		return;
	},

	setStorage(value){
		if(value == 'partial'){
			this.delete.complete = false;
			this.delete.partial = true;
		} else {
			this.delete.complete = true;
			this.delete.partial = false;
		}
	},

	getStorageVal(){
		for(let prop in userSetting['storage']){
			console.log(userSetting['storage'][prop], prop, '<---')
			if(userSetting['storage'][prop]){
				return prop;
			}

		}

		return;
	}
}


// from mdn
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function extractFromLocal(){
	console.log('asssss', storageAvailable('localStorage'), userSetting.storage.local);
	if(storageAvailable('localStorage') && userSetting.storage.local){
		if(localStorage.getItem('objs')){
			let objs = window.localStorage.getItem('objs');
			createLocalObjs(JSON.parse(objs));
		} else {
			populateStorage();
		}
	}
}

function createLocalObjs(objs){
	function traverseObj(obj){
		for(let prop in obj){
			console.log(obj[prop].type, '<---prop');
			if(obj[prop].type == 'dir' || obj[prop].type == 'project'){
				console.log(obj[prop].title, '<--- title');
			}
		}
	}

	traverseObj(objs);
}

function populateStorage(){
	localStorage.setItem('objs',  JSON.stringify(storage.objs));
	localStorage.setItem('userSettingStorage', JSON.stringify(userSetting.storage));
	localStorage.setItem('userSettingDelete', JSON.stringify(userSetting.delete));

}
