// Generated by CoffeeScript 2.6.1
(function() {
  //!/usr/bin/env coffee
  var CMD, bind, extract_li, main;

  CMD = new Set('if else elseif key each await then catch html const debug'.split(' '));

  extract_li = function(html, begin, end, replace) {
    var e, end_len, len, li, p, pre;
    len = begin.length;
    end_len = 1 + end.length;
    pre = p = 0;
    li = [];
    while (true) {
      p = html.indexOf(begin, p);
      if (p < 0) {
        li.push(html.slice(pre));
        break;
      }
      p += len;
      e = html.indexOf(end, p);
      if (e < 0) {
        break;
      }
      li.push(html.slice(pre, p));
      li.push(replace(html.slice(p, e)));
      pre = e;
      p = end_len + e;
    }
    console.log('-----');
    return li.join('');
  };

  bind = (pug) => {
    return extract_li(pug, '(', ')', (txt) => {
      return txt.split(' ').map((line) => {
        var attr, begin, end, replace, wrap;
        attr = line.trimStart();
        begin = line.length - attr.length;
        attr = attr.trimEnd();
        end = begin + attr.length;
        begin = line.slice(0, begin);
        end = line.slice(end);
        wrap = (txt) => {
          return line = begin + txt + end;
        };
        replace = (key, to) => {
          var at_pos, pos;
          at_pos = attr.indexOf(key) + key.length;
          pos = attr.indexOf('=', at_pos) + 1;
          return wrap(attr.slice(0, at_pos - 1) + to + ":" + attr.slice(at_pos, pos) + '"{' + attr.slice(pos) + '}"');
        };
        if (attr) {
          if (attr.indexOf('="') < 0) {
            switch (attr.charAt(0)) {
              case '@':
                replace('@', 'on');
                break;
              case ':':
                replace(':', 'bind');
            }
          }
        }
        return line;
      }).join(' ');
    });
  };

  module.exports = main = (pug) => {
    var cmd, i, j, len1, li, line, pos, ref, ts;
    li = [];
    ref = bind(pug).split('\n');
    for (j = 0, len1 = ref.length; j < len1; j++) {
      line = ref[j];
      ts = line.trimStart();
      i = ts.trimEnd();
      if (i.charAt(0) === '+') {
        pos = i.indexOf(' ', 2);
        if (pos > 0) {
          cmd = i.slice(1, pos);
          if (CMD.has(cmd)) {
            line = ''.padEnd(line.length - ts.length) + i.slice(0, pos) + '(\'' + i.slice(pos + 1).replaceAll('\'', '\\\'') + '\')';
          }
        }
      }
      li.push(line);
    }
    return li.join('\n');
  };

  if (process.argv[1] === __filename) {
    console.log(main(`+if 1

  form(
    @submit|preventDefault=submit
  )

form(:value=test @click=hi)
`));
  }

}).call(this);
