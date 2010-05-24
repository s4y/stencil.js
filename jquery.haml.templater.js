(function(){
	var templater = function (template, data){
		if ($.isArray(template)) {
			template = Array.prototype.slice.call(template, 0);
			for(var i = 0, l = template.length; i < l; i++){
				template.splice(i, 1, templater(template[i], data));
			}
		} else if($.isPlainObject(template)) {
			if ('key' in template) {
				if (template.handler) {
					template = template.handler.call(data[template.key]);
				} else if (template.children) {
					template = $.map(data[template.key], function(item){
						return [templater(template.children, item)];
					});
				} else if (template.conditional) {
					template = data[template.key] ? templater(template.conditional, data) : [];
				} else {
					template = (template.key === '' ? data : data[template.key] || '').toString();
				}
			} else {
				template = $.extend({}, template);
				for (var key in template){
					template[key] = templater(template[key], data);
				}
			}
		}
		return template;
	}
	window.templater = templater;
})();