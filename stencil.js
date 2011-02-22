(function(){
	function stencil(template, data, index, dataIndex){
		if ($.isArray(template)) {
			template = Array.prototype.slice.call(template, 0);
			for(var i = 0, l = template.length; i < l; i++){
				template.splice(i, 1, stencil(template[i], data, i, dataIndex));
			}
		} else if($.isPlainObject(template)) {
			if ('$join' in template) {
				return stencil(template.$join, data, index, dataIndex).join(template.$separator || '');
			} else if ('$or' in template) {
				template = stencil(template.$or, data, index, dataIndex);
				for(var i = 0, l = template.length; i < l; i++){
					if (template[i]) {
						return template[i];
					}
				}
				return template[i-1];
			} else if ('$test' in template) {
				if (stencil(template.$test, data, index, dataIndex)) {
					return stencil(template.$if, data, index, dataIndex) || [];
				} else {
					return stencil(template.$else, data, index, dataIndex) || [];
				}
			} else if ('$handler' in template) {
				return template.$handler.call(template, ('$key' in template) ? data[template.$key] : data);
			} else if ('$template' in template) {
				return [stencil(template.$template, ('$key' in template) ? data[template.$key] : data, index, ('$key' in template) ? template.$key : dataIndex)];
			} else if ('$children' in template) {
				data = template.$key ? data[template.$key] : data;
				if ($.isPlainObject(data)) {
					var key, childTemplate = template.$children;
					template = [];
					for (key in data) {
						template.push(stencil(childTemplate, data[key], index, key));
					}
					return template;
				}
				return $.map(data, function(item, i){
					return [stencil(template.$children, item, i)];
				});
			} else if ('$key' in template) {
				template = (template.$key === '' ? data : template.$key === '.' ? dataIndex : (data[template.$key] === undefined || data[template.$key] == null) ? '' : data[template.$key]).toString();
			} else if(index === 1) {
				template = $.extend({}, template);
				for (var key in template){
					template[key] = stencil(template[key], data, key, dataIndex);
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
