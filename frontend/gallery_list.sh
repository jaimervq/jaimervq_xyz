mkdir -p lib
echo '[' > lib/gallery_digital.json
ls public/gallery/digital | grep -Ei '\.(jpe?g|png|gif|webp)$' | sed 's#^#/gallery/digital/#' | sed 's#.*#  "&"#' | paste -sd, >> lib/gallery_digital.json
echo ']' >> lib/gallery_digital.json

echo '[' > lib/gallery_traditional.json
ls public/gallery/traditional | grep -Ei '\.(jpe?g|png|gif|webp)$' | sed 's#^#/gallery/traditional/#' | sed 's#.*#  "&"#' | paste -sd, >> lib/gallery_traditional.json
echo ']' >> lib/gallery_traditional.json