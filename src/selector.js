// borrowed from cmake-docs/Utilities/Sphinx/version-switch.js
(function() {
  'use strict';

  // Sphinx and Doxygen generated documentation includes jQuery
  // use current URL pattern for subsitution.
  var url_re = /Doc\/(Nightly|(v\d\.\d))\/www\/(cxx|py)-doc\//;
  var flavor = 'cxx';
  var htmlRoot = null;
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
          buf.push(current_release ? current_release : current_version);
        } else {
          buf.push(title + ' (' + (current_release ? current_release : current_version) + ')');
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
    return url.replace(url_re, 'Doc/' + new_version + '/www/' + flavor + '-doc/');
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
           window.location.href = (htmlRoot ? htmlRoot : 'https://www.paraview.org/ParaView/Doc/') + selected + '/www/' + flavor + '-doc/';
        }
      });
    }
  }

  $(document).ready(function() {
    var match = url_re.exec(window.location.href);
    if (match) {
      // set global root, flavor for this docset.
      // console.log(match[1], match[2], match[3]);
      flavor = match[3];
      // get the base URL, including the Doc/ parent dir.
      htmlRoot = match.input.slice(0, match.index) + 'Doc/';
      // set by Sphinx in generated documentation:
      var release = typeof(DOCUMENTATION_OPTIONS) !== "undefined" ? DOCUMENTATION_OPTIONS.VERSION: null;
      var version = match[1];
      var select = build_select(version, release);
      if (flavor === 'py') {
        $('.wy-side-nav-search li.version').html(select);
        $('.wy-side-nav-search li.version select').bind('change', on_switch);
      } else if (flavor === 'cxx') {
        // create a div, add to header
        var selectContainer = $('<div/>', {
          class: 'versionSwitch',
          css: {
            display: "inline-block",
            "margin-left": "15px",
          }
        });
        selectContainer.appendTo('#projectname');
        selectContainer.append(select);
        $('#projectname select').bind('change', on_switch);
      }
    }
  });
})();
