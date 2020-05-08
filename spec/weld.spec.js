const weld = require('../src');

describe('weld', function() {	
	afterAll(function (){		
		weld.applyBindings()
	});

	it('string binding value', function(){		
		var binder = "testString"
		var expected = "here";

		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ': "' + expected + '"');
		document.body.appendChild(element);

		weld.addBinder(binder, function(el, msg) {			
			expect(msg).toEqual(expected);
		});
	});

	it('int binding value', function(){		
		var binder = "testInt"
		var expected = 1;

		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ': ' + expected);
		document.body.appendChild(element);

		weld.addBinder(binder, function(el, msg) {			
			expect(msg).toEqual(expected);
		});
	});

	it('boolean binding value', function(){		
		var binder = "testBoolean"
		var expected = true;

		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ': '+ expected);
		document.body.appendChild(element);

		weld.addBinder(binder, function(el, msg) {			
			expect(msg).toEqual(expected);
		});
	});

	it('mutiple binding values', function(){		
		var binder = "testMulti"
		var expected = "here";
		var expected2 = 2;
		var expected3 = 3;

		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ': "' + expected + '", p2: ' + expected2 + ', p3: ' + expected3);
		document.body.appendChild(element);

		weld.addBinder(binder, function(el, msg, values) {					
			expect(msg).toEqual(expected);
			expect(values['p2']).toEqual(2);
			expect(values['p3']).toEqual(3);
		});
	});

	it('object literal binding value', function(){
		var binder = "testObjectLiteral"
		var expected = { name: "weld", "version": 1, "awesome": true };
		
		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ": { name: 'weld', version: 1, awesome: true }");
		document.body.appendChild(element);
		
		weld.addBinder(binder, function(el, obj) {					
			expect(obj.name).toEqual(expected.name);
			expect(obj.version).toEqual(expected.version);
			expect(obj.awesome).toEqual(expected.awesome);			
		});
	});

	it('expression binding value', function(){
		var binder = "testExpression"
		var expected = 0;	
		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ": function() { return 0; }");
		document.body.appendChild(element);
		
		weld.addBinder(binder, function(el, expr) {						
			expect(expr()).toEqual(expected);
		});
	});

	it('ternary expression binding value', function(){
		var binder = "testTernary"
		var expected = 'no';	
		var element = document.createElement('div');
		element.setAttribute('data-bind', binder + ": 0 == 1 ? 'yes' : 'no'");
		document.body.appendChild(element);
		
		weld.addBinder(binder, function(el, expr) {									
			expect(expr).toEqual(expected);
		});
	});
});