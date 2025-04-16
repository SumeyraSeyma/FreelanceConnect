import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  handler: (req, res) => {
    res.status(429).send("Too many requests, please try again later.");
  },
  keyGenerator: (req) => req.ip, 
});
