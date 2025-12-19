#!/usr/bin/env sh
set -e

CONFIG_PATH="${CONFIG_PATH:-/app/config.js}"

require() {
  [ -n "$(eval echo \$$1)" ] || {
    echo "Missing env var: $1" >&2
    exit 1
  }
}

require HOSTNAME
require API_KEY
require LIBRARY_LOGO_URL
require FEATURE_IMAGE_URL
require LIBRARY_NAME_STRING
require ORGANIZATION_NAME_STRING
require API_LIBRARY_NAME
require API_CIRC_DESK

PERMIT_IP_ADDRESSES_JSON="${PERMIT_IP_ADDRESSES_JSON:-["127.0.0.1","172.16.254.0/24","172.16.15.0/24","172.18.15.0/24"]}"

cat > "$CONFIG_PATH" <<EOF
module.exports = {
  hostname: "$HOSTNAME",
  apiKey: "$API_KEY",
  locations: [{
    libraryLogoUrl: "$LIBRARY_LOGO_URL",
    featureImageUrl: "$FEATURE_IMAGE_URL",
    libraryNameString: "$LIBRARY_NAME_STRING",
    organizationNameString: "$ORGANIZATION_NAME_STRING",
    apiLibraryName: "$API_LIBRARY_NAME",
    apiCircDesk: "$API_CIRC_DESK",
    permitIpAddresses: $PERMIT_IP_ADDRESSES_JSON
  }]
}
EOF

echo "config.js generated at $CONFIG_PATH"
exec "$@"
