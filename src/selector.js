// borrowed from cmake-docs/Utilities/Sphinx/version-switch.js
(function() {
  'use strict';

  // Sphinx generated documentation includes jQuery
  var url_re = /Doc\/(Nightly|(v\d\.\d))\//;
  var all_versions = {
    'Nightly': 'latest nightly',
    'v5.4': '5.4',
  };

  function build_select(current_version, current_release) {
    var buf = ['<select>'];

    Object.keys(all_versions).forEach(function(version) {
      var title = all_versions[version];
      buf.push('<option value="' + version + '"');
      if (version == current_version) {
        buf.push(' selected="selected">');
        if (version[0] == 'v') {
          buf.push(current_release);
        } else {
          buf.push(title + ' (' + current_release + ')');
        }
      } else {
        buf.push('>' + title);
      }
      buf.push('</option>');
    });

    buf.push('</select>');
    return buf.join('');
  }

  function patch_url(url, new_version) {
    return url.replace(url_re, 'Doc/' + new_version + '/');
  }

  function on_switch() {
    var selected = $(this).children('option:selected').attr('value');

    var url = window.location.href,
        new_url = patch_url(url, selected);

    if (new_url != url) {
      // check beforehand if url exists, else redirect to version's start page
      $.ajax({
        url: new_url,
        success: function() {
           window.location.href = new_url;
        },
        error: function() {
           window.location.href = 'https://www.paraview.org/ParaView/Doc/' + selected;
        }
      });
    }
  }

  $(document).ready(function() {
    var match = url_re.exec(window.location.href);
    if (match) {
      // set by Sphinx in generated documentation:
      var release = DOCUMENTATION_OPTIONS.VERSION;
      var version = match[1];
      var select = build_select(version, release);
      $('.wy-side-nav-search li.version').html(select);
      $('.wy-side-nav-search li.version select').bind('change', on_switch);
    }
  });
})();
