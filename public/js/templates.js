function attrs(e){var t=[],n=e.terse;delete e.terse;var r=Object.keys(e),i=r.length;if(i){t.push("");for(var s=0;s<i;++s){var o=r[s],u=e[o];"boolean"==typeof u||null==u?u&&(n?t.push(o):t.push(o+'="'+o+'"')):"class"==o&&Array.isArray(u)?t.push(o+'="'+escape(u.join(" "))+'"'):t.push(o+'="'+escape(u)+'"')}}return t.join(" ")}function escape(e){return String(e).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var NW=NW||{};NW.templates=NW.templates||{};var jade={attrs:attrs,escape:escape};NW.templates.enter_token=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"sync_with_phone"})),buf.push("><h3>Please Enter Your Game Token</h3><input"),buf.push(attrs({id:"game_token",placeholder:"game token here",autocapitalize:"off",autocomplete:"off",autocorrect:"off"})),buf.push("/><div"),buf.push(attrs({"class":"play btn"})),buf.push(">ok!</div></div>")}return buf.join("")},NW.templates.give_token=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"sync_with_desktop"})),buf.push("><h3>Please Enter This Token On Controller</h3><h5"),buf.push(attrs({"class":"token"})),buf.push("></h5></div>")}return buf.join("")},NW.templates.choose_mode=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"choose_mode"})),buf.push("><h3>Choose Your Mode</h3><div"),buf.push(attrs({id:"mode_toggle","class":"toggle"})),buf.push("><div"),buf.push(attrs({"class":"btn first controller"})),buf.push(">controller</div><div"),buf.push(attrs({"class":"btn second screen"})),buf.push(">screen</div></div></div>")}return buf.join("")},NW.templates.controller_view=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"controller_screen"})),buf.push("><button"),buf.push(attrs({"class":"btn fire"})),buf.push(">Fire</button></div>")}return buf.join("")},NW.templates.controller_calibrate=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"controller_calibrate"})),buf.push("><h3>First lets calibrate your controller!</h3><p>Tilt your controller to match the <b>orange</b> box</p><div"),buf.push(attrs({"class":"btn start"})),buf.push(">Start</div><div"),buf.push(attrs({style:"display: none","class":"calibrate"})),buf.push("><div"),buf.push(attrs({"class":"counter"})),buf.push('>Please Hold For -- <b class="countdown"></b></div><div'),buf.push(attrs({"class":"to_follow"})),buf.push("></div></div></div>")}return buf.join("")},NW.templates.game_view=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"game_view"})),buf.push("><div"),buf.push(attrs({id:"game_wrap"})),buf.push("><div"),buf.push(attrs({id:"cr-stage"})),buf.push("></div></div><canvas"),buf.push(attrs({id:"generator"})),buf.push("></canvas></div>")}return buf.join("")},NW.templates.player_connect_view=function anonymous(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"player_connect"})),buf.push("><ul><li"),buf.push(attrs({"class":"p1 connected"})),buf.push(">Connected</li><li"),buf.push(attrs({"class":"p2"})),buf.push(">player 2</li><li"),buf.push(attrs({"class":"p3"})),buf.push(">player 3</li><li"),buf.push(attrs({"class":"p4"})),buf.push(">player 4</li></ul></div>")}return buf.join("")}