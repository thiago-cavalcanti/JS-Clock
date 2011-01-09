require 'jsmin'

File.open('jsclock-0.2.js', 'r') {|file| puts JSMin.minify(file) }
