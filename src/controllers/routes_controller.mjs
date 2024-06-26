import RouteService from "../services/routes_service.mjs";

export default class RouteController {
  static async apiCreateRoute(req, res, next) {
    try {
      const {
        intro_message,
        outro_message,
        intro_video,
        outro_video,
        total_time,
      } = req.body;

      const serviceResponse = await RouteService.addRoute(
        intro_message,
        outro_message,
        intro_video,
        outro_video,
        total_time
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Route created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateRoute(req, res, next) {
    try {
      const _id = req.query.id;
      const {
        intro_message,
        outro_message,
        intro_video,
        outro_video,
        total_time,
        terms_and_conditions,
        privacy_policy,
      } = req.body;

      const serviceResponse = await RouteService.updateRouteDetails(
        _id,
        intro_message,
        outro_message,
        intro_video,
        outro_video,
        total_time,
        terms_and_conditions,
        privacy_policy
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetRouteSettings(req, res, next) {
    try {
      const _id = req.query.id;
      const serviceResponse = await RouteService.getRouteSettings(_id);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Route details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetRoute(req, res, next) {
    try {
      const _id = req.query.id;
      const serviceResponse = await RouteService.getRouteByID(_id);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Route details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAllRoutes(req, res, next) {
    try {
      const code = req.query.code;

      const serviceResponse = await RouteService.getAllChallengesAndRoute(code);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Challenge and Route details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSetStartTime(req, res, next) {
    try {
      const id = req.query.id;
      const code = req.query.code;
      const serviceResponse = await RouteService.startRouteForTeam(id, code);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Route details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiMarkRouteComplete(req, res, next) {
    try {
      const id = req.query.id;
      const team_code = req.query.code;
      const serviceResponse = await RouteService.endRouteForTeam(id, team_code);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Route details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
