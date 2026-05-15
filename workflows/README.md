# n8n Workflows

These are exported [n8n](https://n8n.io) automation workflows that complement the GrowthDesk app.

| File | Purpose |
|------|---------|
| `ticket_workflow.json` | End-to-end support ticket lifecycle (intake → triage → SLA tracking → resolution) |
| `complaint_escalation.json` | Escalates high-priority complaints with auto-notification to admin |
| `talk_to_human.json` | Routes chatbot "talk to human" requests to the team |

## Configure before importing

Each workflow notifies an admin email address. The placeholder `admin@yourdomain.com` is used throughout — search-and-replace with your real admin inbox **before importing into n8n**:

```bash
# From the repo root
sed -i 's/admin@yourdomain\.com/your.real.email@domain.com/g' workflows/*.json
```

Or open each JSON and replace manually — every `sendTo` and `replyTo` field is the relevant config.

## Import into n8n

1. In n8n, go to **Workflows → Import from File**
2. Pick the JSON file
3. Re-connect any credentials n8n flags as missing (Gmail / SMTP node, HTTP Request nodes, etc.)
4. Toggle the workflow **Active** once you've tested it manually
