# What's stencil.js?

`stencil.js` is a preprocessor for [`jquery-haml`](http://github.com/creationix/jquery-haml) that joins your templates and data.

# Example

Here's the data behind a product listing…

    var data = {
    	name: "Food blender",
    	price: "99.95",
    	reviews: [
    		{
    			reviewer: "Bob",
    			date: "2010-06-18T00:14:40.687Z",
    			review: "It sucks."
    		},
    		{
    			reviewer: "Steve",
    			date: "2010-06-19T00:14:40.687Z",
    			review: "It's awesome."
    		}
    	]
    },

…here's how you want to render it…

    var template = ['#product',
    	['%h1', {key:'name'}], ['%h2', {key:'price'}],
    	['%ul#reviews', {key: 'reviews', children:['%li',
    			['%p.name', {key:'reviewer'}, ' (', ['%span', {key:'date'}], ')'],
    			['%p', {key:'review'}]
    	]}]
    ];

Run it through `stencil` and `jquery-haml`…

	$(document.body).haml(stencil(template, data));
	
…and DOM comes out.

    <div id="product">
    	<h1>Food blender</h1>
    	<h2>99.95</h2>
    	<ul id="reviews">
    		<li>
    			<p class="name">
    				Bob (<span>2010-06-18T00:14:40.687Z</span>)
    			</p>
    			<p>
    				It sucks.
    			</p>
    		</li>
    		<li>
    			<p class="name">
    				Steve (<span>2010-06-19T00:14:40.687Z</span>)
    			</p>
    			<p>
    				It's awesome.
    			</p>
    		</li>
    	</ul>
    </div>

---

`stencil.js` works great with [`Trapper.js`](http://github.com/Sidnicious/Trapper.js)!