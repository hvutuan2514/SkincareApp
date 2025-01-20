To run the app, go to the directory of the app and run the command:
```bash
npm start
```
products dataset imported into supabase: https://www.kaggle.com/datasets/eward96/skincare-products-clean-dataset

Skin Analyzer API: https://console.faceplusplus.com/documents/129100210

TODO:
2) ingredient to product - parsing algorithm (ALMOST DONE)
    - match product to MOST ingredients covered
4) style website
5) put an image per product --> attempt to fetch image from url
6) NEXT: Feature to filter product cards based off pricing and routine steps

DONE:
1) skin concern to ingredient - database + parsing algorithm 

*Not sure if this is needed but since the results of the AI skin analysis is all in one file, should we combine skin quiz and results into one file or split SkinAnalysis.js into two files?*
