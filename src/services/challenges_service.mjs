import ChallengeDAO from "../data/challenges_dao.mjs";
import { ObjectId } from "mongodb";
import PatternUtil from "../utility/pattern_util.mjs";
import RouteService from "./routes_service.mjs";
import RouteDAO from "../data/routes_dao.mjs";
import QuestionDAO from "../data/questions_dao.mjs";
import AnswerDAO from "../data/answers_dao.mjs";

export default class ChallengeService {
  static async connectDatabase(client) {
    try {
      await ChallengeDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addChallenge(
    name,
    difficulty,
    longitude,
    latitude,
    route,
    description
  ) {
    try {
      const createdOn = new Date();
      const deletedOn = null;

      const new_route_id = new ObjectId(route);

      const chalDocument = {
        name: name,
        difficulty: difficulty,
        longitude: longitude,
        latitude: latitude,
        questions: 0,
        total_score: 0,
        route: new_route_id,
        description: description,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedChalId = await ChallengeDAO.addChallengeToDB(chalDocument);
      const challenge = await ChallengeDAO.getChallengeByIDFromDB(addedChalId);

      const filteredChallenge = PatternUtil.filterParametersFromObject(
        challenge,
        ["created_on", "deleted_on"]
      );

      return { challenge: filteredChallenge };
    } catch (e) {
      return e.message;
    }
  }

  static async getChallengeByID(chalId) {
    try {
      const existingChallenge = await ChallengeDAO.getChallengeByIDFromDB(
        chalId
      );
      if (!existingChallenge) {
        return "No challenge found for this ID";
      } else {
        if (existingChallenge.route != null) {
          const chalResponse = await RouteService.getRouteByID(
            existingChallenge.route
          );
          if (typeof chalResponse !== "string") {
            existingChallenge.route = chalResponse;
          }
        }
        const filteredChallenge = PatternUtil.filterParametersFromObject(
          existingChallenge,
          ["created_on", "deleted_on"]
        );
        return filteredChallenge;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getChallengesByRoute(routeId) {
    try {
      const existingChallenge = await ChallengeDAO.getChallengeByRouteFromDB(
        routeId
      );
      if (!existingChallenge) {
        return "No challenge found for this route";
      } else {
        for (let i = 0; i < existingChallenge.length; i++) {
          if (existingChallenge[i].route != null) {
            const chalResponse = await RouteService.getRouteByID(
              existingChallenge[i].route
            );
            if (typeof chalResponse !== "string") {
              existingChallenge[i].route = chalResponse;
            }
          }
          const filteredChallenge = PatternUtil.filterParametersFromObject(
            existingChallenge[i],
            ["created_on", "deleted_on"]
          );
          existingChallenge[i] = filteredChallenge;
        }
        return existingChallenge;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateChallenges(
    id,
    name,
    difficulty,
    longitude,
    latitude,
    questions,
    total_score,
    route,
    description,
    intro_url
  ) {
    try {
      let existingChallenge = await ChallengeDAO.getChallengeByIDFromDB(id);
      if (!existingChallenge) {
        return "No challenge found for this id";
      }

      if (name) {
        existingChallenge.name = name;
      }

      if (difficulty) {
        existingChallenge.difficulty = difficulty;
      }

      if (longitude) {
        existingChallenge.longitude = longitude;
      }

      if (latitude) {
        existingChallenge.latitude = latitude;
      }

      if (questions) {
        existingChallenge.questions = questions;
      }

      if (total_score) {
        existingChallenge.total_score = total_score;
      }

      if (route) {
        existingChallenge.route = route;
      }

      if (description) {
        existingChallenge.description = description;
      }

      if (intro_url) {
        existingChallenge.intro_url = intro_url;
      }

      const updateResult = await ChallengeDAO.updateChallengeInDB(
        existingChallenge
      );

      existingChallenge = await ChallengeDAO.getChallengeByIDFromDB(id);

      if (updateResult) {
        return existingChallenge;
      } else {
        return "Failed to update the challenge";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateChallengeStats(id, total_score) {
    try {
      const existingChallenge = await ChallengeDAO.getChallengeByIDFromDB(id);
      if (!existingChallenge) {
        return "No challenge found for this id";
      }

      existingChallenge.questions += 1;

      if (total_score) {
        existingChallenge.total_score += total_score;
      }

      const updateResult = await ChallengeDAO.updateChallengeInDB(
        existingChallenge
      );

      if (updateResult) {
        return {};
      } else {
        return "Failed to update the challenge";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getChallengeSummary(chalId, team_code) {
    try {
      const [existingChallenge, existingAnswer] = await Promise.all([
        ChallengeDAO.getChallengeByIDFromDB(chalId),
        AnswerDAO.getAnswerByTeamCode(team_code),
      ]);

      if (!existingChallenge) {
        return "No challenge found for this id";
      }

      if (!existingAnswer) {
        return "No answer found for this team code";
      }

      let total_score = 0;

      for (let i = 0; i < existingAnswer.length; i++) {
        const existingQues = await QuestionDAO.getQuestionByIDFromDB(
          existingAnswer[i].question
        );
        existingAnswer[i].question = existingQues.question;
        existingAnswer[i].challengeId = existingQues.challenge;

        total_score += existingAnswer[i].score;
      }

      const challengeId = existingChallenge._id.toString();

      const challengeAnswers = existingAnswer.filter(
        (answer) => answer.challengeId.toString() === challengeId
      );

      const filteredChallenge = PatternUtil.filterParametersFromObject(
        existingChallenge,
        ["created_on", "deleted_on"]
      );

      filteredChallenge.total_score = total_score;
      // filteredChallenge.answers = challengeAnswers;

      return { challenge: filteredChallenge, answers: challengeAnswers };
    } catch (e) {
      return e.message;
    }
  }
}
