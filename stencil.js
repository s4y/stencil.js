(function(){
	function stencil(template, data, index){
		if ($.isArray(template)) {
			template = Array.prototype.slice.call(template, 0);
			for(var i = 0, l = template.length; i < l; i++){
				template.splice(i, 1, stencil(template[i], data, i));
			}
		} else if($.isPlainObject(template)) {
			if ('$join' in template) {
				return stencil(template.$join, data).join(template.$separator || '');
			} else if ('$or' in template) {
				template = stencil(template.$or, data);
				for(var i = 0, l = template.length; i < l; i++){
					if (template[i]) {
						return template[i];
					}
				}
				return template[i-1];
			} else if ('$test' in template) {
				if (stencil(template.$test, data)) {
					return stencil(template.$if, data) || [];
				} else {
					return stencil(template.$else, data) || [];
				}
			} else if ('$handler' in template) {
				return template.$handler.call(template, ('$key' in template) ? data[template.$key] : data);
			} else if ('$template' in template) {
				return [stencil(template.$template, ('$key' in template) ? data[template.$key] : data)];
			} else if ('$children' in template) {
				return $.map(template.$key === "" ? data : data[template.$key], function(item){
					return [stencil(template.$children, item)];
				});
			} else if ('$key' in template) {
				template = (template.$key === '' ? data : template.$key === '.' ? index : (data[template.$key] === undefined || data[template.$key] == null) ? '' : data[template.$key]).toString();
			} else if(index === 1) {
				template = $.extend({}, template);
				for (var $key in template){
					template[$key] = stencil(template[$key], data);
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