let choreo = require("../src/");
let mockEnv = require("./util");

/*
     This is a simple example of a book creation process.
 */

choreo.initialiseChoreo(mockEnv);

choreo.defineChoreography("Create Book Example", {
    start: (c, p, u, s) => {
        this.callTask("plan", c);
        this.next("end");
    },
    plan: (c) => {
        let w = this.work();
        w.add("planChapter", { chapter: "C1" });
        w.add("planChapter", { chapter: "C2" });
        w.add("planChapter", { chapter: "C3" });
        w.runAll();
        this.next((result) => {
            this.return({ title: c.goal, chapters: result });
        });
    },
    planChapter: (c) => {
        let w = this.work();
        w.add("executeParagraph", { chapter: c.chapter, paragraph: "p1" });
        w.add("executeParagraph", { chapter: c.chapter, paragraph: "p2" });
        w.add("executeParagraph", { chapter: c.chapter, paragraph: "p3" });
        w.add("executeParagraph", { chapter: c.chapter, paragraph: "p4" });
        w.runAll();
    },
    executeParagraph: (c) => {
        this.return({
            text: "Text for chapter " + c.chapter + "paragraph " + c.paragraph
        })
    },
    end: (c) => {
        console.log(c);
        this.return(c);
    }
});