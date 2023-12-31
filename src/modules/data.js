import * as logic from './logic.js'
export { storage }

const storage = {
	objs: {title: 'objs',},
	counter: 0,


	getObj([prop, value], level=this.objs){
		if(Object.keys(level).length > 0){
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
				if(level[item]['type'] == 'project'){
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
		let projectHost = this.getObj(['title', obj.project]) ? this.getObj(['title', obj.project]) : this.objs;

		// loop through its elements to check if there is a title conflic
		for(let item in projectHost){
			if(projectHost[item]['title'] == obj.title){
				return false;
			}
		}

		return true;
	},

	addObj(obj={}){
		if(this.uniqueAtLevel(obj)){
			// identify the obj with an unique id prop.
			if(!obj.id){
				obj.id = `${obj.type[0]}${this.counter}`;
				this.counter++;
			}

			// project == '': main || non-project: unassigned
			if(obj.project == ''){
				if(obj.type == 'project'){
					this['objs'][obj.title] = obj;
				}
				else {
					this['objs'][obj.id] = obj;
				}
			}

			// project == !'': sub || non-project: assigned
			else {
				// project exist
				if(this.getObj(['title', obj.project], this.objs)){
					let projectHost = this.getObj(['title', obj.project]) ? this.getObj(['title', obj.project]) : this.objs;

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
					let projectHost = logic.createItem(obj);
					this.addObj(projectHost);
					this.addObj(obj);
				}
			}
		} else {
			return;
		}
	},

	removeObj(obj={}){
		// main project, or unassigned task.
		if(obj.project == ''){
			if(obj.type == 'project'){
				delete this.objs[obj.title];
			}
			else {
				delete this.objs[obj.id];
			}
		}
		// inside a project
		else {
			let projectHost = this.getObj(['title', obj.project]) ? this.getObj(['title', obj.project]) : this.objs;

			if(obj.type == 'project'){
				delete projectHost[obj.title];
			}
			else {
				delete projectHost[obj.id];
			}
		}
		return;
	},

	updateObj(obj={}, [prop, value]){
		//special cases: when a change in an obj's property requires re-add the obj
			// projects: title, project && non-projects: project
		if(obj.type == 'project' && prop == 'title' || obj.type == 'project' && prop == 'project' ||
			obj.type !== 'project' && prop == 'project'){
			let tempObj = Object.create(Object.getPrototypeOf(obj));
			Object.assign(tempObj, obj);
			tempObj[prop] = value;

			if(this.uniqueAtlevel(tempObj)){
				this.removeObj(obj);
				this.addObj(tempObj);
			}
		}

		//setting props || updating props
		else if(obj.type && this.uniqueAtLevel(obj)){
			if(prop !== 'id' && prop !== 'type'){
				// main project, or unassigned task.
				if(obj.project == ''){
					if(obj.type == 'project'){
						this.objs[obj.title][prop] = value;
					}
					else {
						this.objs[obj.id][prop] = value;
					}
				}
				// inside a project
				else {
					let projectHost = this.getObj(['title', obj.project]) ? this.getObj(['title', obj.project]) : this.objs;

					if(obj.type == 'project'){
						projectHost[obj.title][prop] = value;
					}
					else {
						projectHost[obj.id][prop] = value;
					}

				}
				return;
			}
		}
	},

}
