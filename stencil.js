(function(){
	function stencil(template, data, index){
		if ($.isArray(template)) {
			template = Array.prototype.slice.call(template, 0);
			for(var i = 0, l = template.length; i < l; i++){
				template.splice(i, 1, stencil(template[i], data, i));
			}
		} else if($.isPlainObject(template)) {
			if ('key' in template) {
				if (template.handler) {
					template = template.handler.call(data[template.key]);
				} else if (template.template) {
					return [stencil(template.template, data[template.key])];
				} else if (template.children) {
					template = $.map(template.key === "" ? data : data[template.key], function(item){
						return [stencil(template.children, item)];
					});
				} else if (template.conditional) {
					template = (data[template.key]) ? stencil(template.conditional, data) : [];
				} else {
					template = (template.key === '' ? data : template.key === '.' ? index : (data[template.key] === undefined || data[template.key] == null) ? '' : data[template.key]).toString();
				}
			} else if(index === 1) {
				template = $.extend({}, template);
				for (var key in template){
					template[key] = stencil(template[key], data);
				}
			}
		}
		return template;
	}
	
	window.stencil = stencil;
	jQuery.fn.stencil = function(template, data){
		this.haml(stencil(template, data));
	};
})();