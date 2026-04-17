const fs = require('fs');

function Dictionary() 
{
    let dict={}; // hashmap to store the word and its score (key-value pair)

    this.add=function(word,score) // add new word and  score
    {
        dict[word]=score;
    };

    this.get = function(word) // get the score of the word
    {
        return dict[word];
    };

    this.has = function(word) // check if the word actually exists in the dictionary
    {
        return dict.hasOwnProperty(word);
    };
}

//SubProgram #1: building Dictionary
function buildSentimentDictionary(FileName)
    {
        let sssTable = new Dictionary();

        try 
        {
        let fileContent = fs.readFileSync(FileName, 'utf-8');
        let lines = fileContent.split('\n');        

                for (let i=1; i<lines.length; i++)
            {
                let line = lines [i];
                if (line.trim() === '') continue; // skip empty lines

                let parts = line.split(',');
                let word = parts[0].trim().toLowerCase();
                let score = parseFloat(parts[1]);

                if (!isNaN(score)) // check if the score is a valid number
                {
                    sssTable.add(word, score);
                }
            }

        }

        catch (err)
        {
            console.error(`Error reading file: ${err}`);
        }

        return sssTable;

    }

//SubProgram #2: analyze the review and calculate score
function getSocialSentimentScore(sssTable, reviewFileName)
        {
            let accumulatedScore = 0;

            try {

            let reviewContent = fs.readFileSync(reviewFileName, 'utf-8');

            let cleanText = reviewContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");

            let words = cleanText.split(/\s+/);

            console.log("[word: current_score, accumulated_score]");

            for (let word of words)
            {
                if (word&&sssTable.has(word))
                {
                    let currentScore = sssTable.get(word);
                    accumulatedScore += currentScore;
                    console.log(`[${word}: ${currentScore}, ${accumulatedScore.toFixed(2)}]`);
                }
            }
        }
            
            catch (err)
                {
                    console.error(`Error reading review file: ${err}`);
                    process.exit(1);
                }

            return accumulatedScore;
        }


// SubProgram #3: convert score to star rating
function starRating(score)
    {
        switch (true) 
            {
                case (score < -5.0):
                    return 1;

                case (score >= -5.0 && score < -1.0):
                    return 2;

                case (score >= -1.0 && score < 1.0):
                    return 3;

                case (score >= 1.0 && score < 5.0):
                    return 4;
                
                case (score >= 5.0):
                    return 5;

                default:
                    return 0;
            }
    }


// Main Program
function main()
{

    console.log("=============================================");
    console.log("Social Sentiment Score Analyzer");
    console.log("HOW TO USE: Enter the following in terminal:\n\n");
    console.log("node main.js [reviewFileName]\n\n");
    console.log("Example: node main.js good.txt\n\n");
    console.log(" If no review file name is provided, it will default to 'review.txt'");
    console.log("=============================================");   
    let reviewFileName = process.argv[2];

    if (!reviewFileName)
        {
            reviewFileName = "review.txt";
        }

    const sssTable = buildSentimentDictionary('socialsent.csv');
    const finalScore = getSocialSentimentScore(sssTable, reviewFileName);
    


    console.log(`\n${reviewFileName} score: ${finalScore.toFixed(2)}`);
    console.log(`${reviewFileName} Stars: ${starRating(finalScore)}`);
}

main();