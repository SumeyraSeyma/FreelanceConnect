import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/User.js";
import Job from "../models/Job.js";
import dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // .env dosyasından al

const seedDatabase = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB bağlantısı başarılı!");

    await User.deleteMany();
    await Job.deleteMany();
    console.log("Eski veriler silindi...");

    let users = [];
    for (let i = 0; i < 20; i++) {
      users.push({
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(["freelancer", "employer"]),
        bio: faker.lorem.sentence(),
        skills: faker.helpers.arrayElements(["JavaScript", "Python", "React"], 3),
        rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log("Kullanıcılar oluşturuldu!");

    let jobs = [];
    for (let i = 0; i < 10; i++) {
      const employer = faker.helpers.arrayElement(createdUsers.filter(user => user.role === "employer"));
      
      jobs.push({
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraph(),
        budget: faker.number.int({ min: 500, max: 10000 }),
        employer: employer._id,
        applicants: faker.helpers.arrayElements(createdUsers.filter(user => user.role === "freelancer"), faker.number.int({ min: 1, max: 5 })).map(user => user._id),
        status: faker.helpers.arrayElement(["open", "closed"]),
        time: faker.helpers.arrayElement(["full-time", "part-time"]),
        remote: faker.datatype.boolean(),
        skills: faker.helpers.arrayElements(["JavaScript", "React", "Node.js"], 3),
        location: faker.location.city(),
      });
    }

    await Job.insertMany(jobs);
    console.log("İş ilanları oluşturuldu!");

  } catch (error) {
    console.error("Seeding sırasında hata oluştu:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Seed işlemini başlat
seedDatabase();
