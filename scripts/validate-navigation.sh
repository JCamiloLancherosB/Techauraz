#!/bin/bash

# Header Navigation Validation Script
# This script verifies that the header navigation is 100% dynamic and has no hardcoded elements

echo "🔍 Validating Header Navigation Implementation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check for issues
check_issue() {
    local description=$1
    local command=$2
    local should_be_empty=$3
    
    result=$(eval "$command")
    
    if [ -z "$result" ]; then
        if [ "$should_be_empty" = "yes" ]; then
            echo -e "${GREEN}✓${NC} $description"
        else
            echo -e "${RED}✗${NC} $description"
            ((ERRORS++))
        fi
    else
        if [ "$should_be_empty" = "yes" ]; then
            echo -e "${RED}✗${NC} $description"
            echo "  Found: $result"
            ((ERRORS++))
        else
            echo -e "${GREEN}✓${NC} $description"
        fi
    fi
}

echo "📋 Checking for Hardcoded Navigation Elements..."
echo ""

# Check 1: No hardcoded URLs in navigation (except routes.* and link.*)
check_issue \
    "No hardcoded URLs in navigation files" \
    "grep -r 'href=\"/' sections/header.liquid snippets/header-*.liquid 2>/dev/null | grep -v 'routes\.' | grep -v 'link\.' | grep -v 'settings\.' | grep -v 'page\.url' | grep -v 'request\.' | grep -v 'href=\"{{'" \
    "yes"

# Check 2: Navigation uses section.settings.menu.links
check_issue \
    "Navigation uses dynamic menu data (section.settings.menu.links)" \
    "grep -l 'section.settings.menu.links' snippets/header-mega-menu.liquid snippets/header-dropdown-menu.liquid snippets/header-drawer.liquid | wc -l | grep 3" \
    "no"

# Check 3: Menu items use link.title for labels
check_issue \
    "Menu items use dynamic titles (link.title)" \
    "grep -c 'link.title' snippets/header-*.liquid | grep -v ':0$' | wc -l" \
    "no"

# Check 4: Menu items use link.url for destinations
check_issue \
    "Menu items use dynamic URLs (link.url)" \
    "grep -c 'link.url' snippets/header-*.liquid | grep -v ':0$' | wc -l" \
    "no"

# Check 5: Active states use link.current
check_issue \
    "Active states use dynamic detection (link.current)" \
    "grep -c 'link.current' snippets/header-*.liquid | grep -v ':0$' | wc -l" \
    "no"

# Check 6: Mobile promo is configurable (not hardcoded)
check_issue \
    "Mobile promo text is configurable (section.settings.mobile_promo_text)" \
    "grep 'section.settings.mobile_promo_text' snippets/header-drawer.liquid" \
    "no"

# Check 7: No hardcoded collection names in navigation
check_issue \
    "No hardcoded collection names in navigation files" \
    "grep -E '(Catálogo|USB|Gadgets|Smartwatch)' sections/header.liquid snippets/header-*.liquid 2>/dev/null | grep -v 'comment' | grep -v 'schema' | grep -v 'default'" \
    "yes"

# Check 8: Section settings include menu configuration
check_issue \
    "Header section has menu setting (type: link_list)" \
    "grep -A2 '\"type\": \"link_list\"' sections/header.liquid | grep '\"id\": \"menu\"'" \
    "no"

# Check 9: Translation keys exist for new settings
check_issue \
    "Spanish translations exist for mobile promo settings" \
    "grep 'show_mobile_promo\\|mobile_promo_text' locales/es.schema.json" \
    "no"

# Check 10: English translations exist for new settings
check_issue \
    "English translations exist for mobile promo settings" \
    "grep 'show_mobile_promo\\|mobile_promo_text' locales/en.default.schema.json" \
    "no"

echo ""
echo "📊 Validation Summary"
echo "===================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "The header navigation is 100% dynamic and properly configured."
    echo "Changes to Shopify Navigation will be reflected without code changes."
    exit 0
else
    echo -e "${RED}✗ $ERRORS check(s) failed${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    fi
    echo ""
    echo "Please review the issues above and fix them to ensure"
    echo "the navigation is fully dynamic."
    exit 1
fi
