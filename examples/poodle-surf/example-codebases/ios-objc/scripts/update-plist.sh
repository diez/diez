#!/bin/bash

plistbuddy() {
  /usr/libexec/PlistBuddy -c "Add :$1 $2 $3" "${TARGET_BUILD_DIR}/${INFOPLIST_PATH}" || \
    /usr/libexec/PlistBuddy -c "Set :$1 $3" "${TARGET_BUILD_DIR}/${INFOPLIST_PATH}"
}

DIEZ_HOT_URL_FILE=$SRCROOT/../../design-language/.diez/ios-hot-url

if [ ! -f $DIEZ_HOT_URL_FILE ]; then
    echo "$DIEZ_HOT_URL_FILE not found. Diez server URL will not be updated."
    exit 0
fi

DIEZ_SERVER_URL=$(cat $DIEZ_HOT_URL_FILE)

echo "Enabling hot mode with URL $DIEZ_SERVER_URL"

plistbuddy DiezIsHot bool true
plistbuddy DiezServerURL string $DIEZ_SERVER_URL
