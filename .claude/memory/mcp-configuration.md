---
name: mcp-configuration
---

# MCP Configuration

## Filesystem Server

- **Path:** `E:/programme/myPortfolio-backend`
- **Purpose:** Allows Claude Code to automatically read files in the project directory when needed

## Security Configurations

1. **Delete Command Protection:**
   - No delete commands will be executed without explicit user approval
   - This includes file deletions and database operations

2. **Database Protection:**
   - No database deletion commands will be executed without explicit user approval
   - All database modifications require user confirmation

## Existing Configurations

- **MCP.json file** has been configured with the project directory path
- **Security rules** have been added to prevent accidental deletions and database modifications

## Next Steps

- Verify that the MCP server connects successfully
- Ensure that the security configurations are enforced
- Update the CLAUDE.md file to include these configurations

[[mcp-configuration]]