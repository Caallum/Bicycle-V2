import EventEmitter from 'events';
import mongo from "mongoose";
import pify from 'pify';

export default class database extends EventEmitter {
	constructor(url, opts) {
		super();
		mongo
			.connect(
				url, {
					useNewUrlParser: true,
    				useUnifiedTopology: true
                }
			)
			.then(() => {
				this.emit('connected', 'Successfully connected to Database');
			})
			.catch(err => {
				this.emit('error', err);
			});
		this.db = mongo.connection;

		if (typeof opts !== 'object') {
			return this.emit('error', 'Options must be in object form');
		}

		if (!opts.name) {
			return this.emit('error', 'Please define a collection name');
		}

		this.collection = this.db.collection(opts.name);
		this.collection.createIndex(
			{ key: 1 },
			{
				unique: true,
				background: true
			}
		)

		this.mongo = ['replaceOne', 'findOne', 'deleteOne', 'find', 'deleteMany'].reduce(
			(obj, method) => {
				obj[method] = pify(this.collection[method].bind(this.collection));
				return obj;
			},
			{}
		);

		this.db.on('error', err => this.emit('error', `{err}`));
	}

	async get(key) {
		return this.mongo.findOne({ key }).then(doc => {
			if (doc === null) {
				return undefined;
			}
			return doc.value;
		});
	}
	
	async fetch(key) {
		return this.mongo.findOne({ key }).then(doc => {
			if (doc === null) {
				return undefined;
			}
			return doc.value;
		});
	}

	async set(key, value) {
	  return this.mongo.replaceOne({ key }, { key, value }, { upsert: true })
	  .then(() => { return true })
	}

	async delete(key) {
		if (typeof key !== 'string') {
			return Promise.resolve(false);
		}

		return this.mongo.deleteOne({ key }).then(() => { return true });
	}

	async search(key) {
		if (typeof key !== 'string') {
			return Promise.resolve(false);
		}
	
	  let documents = await this.mongo.find({ key: new Regex(`${key}`, 'i') }, function(err, data) {
	    if(err) return undefined;
	    if(!data) return undefined;
	  });
	  
	  return documents;
	}
	
	async find(key) {
		if (typeof key !== 'string') {
			return Promise.resolve(false);
		}
	
	  let documents = await this.mongo.find({}, function(err, data) {
	    if(err) return undefined;
	    if(!data) return undefined;
	  });
	  
	  let map = [];
	  
	  
	  await documents.forEach(doc => {
	    if(doc.key.toLowerCase().includes(key.toLowerCase())) {
        map.push({ key: doc.key, value: doc.value })
	    }
	  });
	  return map;
	}
	
	async all() {
	  let documents = await this.mongo.find({}, function (err, data) {
	    if(err) return undefined;
	    if(!data) return undefined;
	  });
	  
	  let map = { data: [] };
	  
	  await documents.forEach(doc => {
	    map.data.push({ key: doc.key, value: doc.value })
	  });
	  
	  if(map.data.length > 0) return map;
	  
	  return undefined;
	}
	
	async clear(key) {
	  if(typeof key !== 'string') {
	    return Promise.resolve(false);
	  }
	  
	  return this.mongo.deleteMany({ key: new RegExp(`${key}`, 'i') })
	    .then(() => {
	      return true;
	    })
	}
	
	async push(key, values) {
	  if(typeof key !== 'string') {
	    return Promise.resolve(false);
	  }
	  
	  let existing = await this.get(key);
	  
	  if(existing) {
	    existing.push(values);
	    
	    return await this.set(key, existing);
	  };
	  
	  return await this.set(key, [values]);
	}
}