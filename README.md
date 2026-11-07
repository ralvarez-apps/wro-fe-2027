# WRO 2027 Future Engineers — Smart Warehouse visualiser

Interactive 3D study tool for the WRO 2027 Future Engineers challenge (Senior and Advanced categories).
Pick a rulebook example or a random round, press play, and watch what the robot has to do: the route it must
take around blocked aisles, which boxes it moves, the 180 s run budget, the 500 mm robot size limit against the
aisle widths, and the score as it accrues. Click any object to see the rule behind it with its PDF page.

```
pnpm install
pnpm dev      # http://localhost:5173
pnpm test
pnpm build    # static site in dist/
```

Rules come from the two PDFs in this repo, digested with page citations in `docs/guides/`. Values the PDFs do not
give (charging-station offsets, zone and order-area coordinates, cone squares, wall thickness) are marked
*assumed* in the app. The Surprise Rule (+50) is not modelled. Robot speed and grip times are illustrative.
