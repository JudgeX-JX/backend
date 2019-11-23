import { Submission, validateSubmission, Verdict } from '../../models/submission';
import { Request, Response } from 'express';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { Problem } from '../../models/problem';

export async function create(req: Request | any, res: Response) {
    const { error } = validateSubmission(req.body);
    if (error) return res.status(422).json({ message: error.details[0].message });

    const problem = await Problem.findById(req.body.problem);
    if (!problem)
        return res
            .status(422)
            .json({ message: `No valid problem with id: ${req.body.problem}` });

    const submission = new Submission(req.body);
    submission.user = req.user._id;

    let testCases: AxiosPromise[] = [];

    problem.inputs.forEach((input: string, index: number) => {
        const testCase = axios.post(
            'https://api.judge0.com/submissions/?wait=true',
            {
                language_id: 15, // C++ latest version
                source_code: req.body.sourceCode,
                stdin: input,
                expected_output: problem.outputs[index]
            }
        );
        testCases.push(testCase);
    });

    Promise.all(testCases).then((res: AxiosResponse[]) => {
        let verdict: Verdict = Verdict.ACCEPTED;
        res.forEach(response => {
            // id	3
            // description	"Accepted"
            // id	4
            // description	"Wrong Answer"
            // id	5
            // description	"Time Limit Exceeded"
            // id	6
            // description	"Compilation Error"
            // id	7
            // description	"Runtime Error (SIGSEGV)"
            // id	13
            // description	"Internal Error"

            // TODO: Better implementation!!!!

            // if any testcase not accepted stop
            if (response.data.status.id != 3) {
                verdict = response.data.status.id;
                return;
            }
        });
        submission.verdict = Verdict[verdict];
        submission.save();
    });
    submission.save();
    res.send(submission);
}