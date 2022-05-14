import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  createCounsellor,
  findCounsellor,
  findAllCounsellor,
  deleteCounsellor,
} from "../service/counselors/counsellor.services";

import {
  createEvent,
  findEvent,
  findAllEvents,
  findAndUpdate,
  deleteEvent,
} from "../service/events/event.services";

import {
  createEventReq,
  findEventReq,
  findAllEventsReq,
  findAndUpdateReq,
  deleteEventReq,
} from "../service/events/eventRequest.services";

import {
  findStudent,
  findAndUpdate as updateStudent,
} from "../service/student/student.services";

export const createEventHandler = async (req: Request, res: Response) => {
  try {
    const eventName = get(req, "body.eventName");
    const counselorId = get(req, "body.createdBy");
    const organizationId = get(req, "body.organizationId");
    const date = get(req, "body.date");

    let eventDate = new Date(date);
    const today = new Date();

    if (eventDate < today) {
      return res.status(403).json({
        status: 403,
        message: "Event event date has to be a future date.",
      });
    }

    const event = await findEvent({
      eventName,
      organizationId,
      date: {
        $gte: new Date(today),
      },
      createdBy: counselorId,
    });

    if (event) {
      return res.status(403).json({
        status: 403,
        message:
          "Event with the same name and date already exists in our database",
      });
    }

    const newEvent = await createEvent(req.body);

    return res.status(200).json({
      status: 200,
      event: newEvent,
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getEventHandler = async (req: Request, res: Response) => {
  try {
    const eventId = get(req, "params.id");

    const event = await findEvent({ _id: eventId });

    if (!event)
      return res.status(404).json({
        status: 404,
        message: "Event not found.",
      });

    return res.status(200).json({
      status: 200,
      event,
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getAllEventsHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");

    if (String(userRole) !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to access this route.",
      });
    }

    const events = await findAllEvents();

    if (!events) {
      return res.status(404).json({
        status: 404,
        message: "No Event Found.",
      });
    }

    return res.status(200).json({
      status: 200,
      events,
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const deleteEventHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "user._id");
    const eventId = get(req, "params.id");
    const counselorId = get(req, "params.createdBy");

    if (String(counselorId) !== String(userId)) {
      if (String(userRole) !== "admin") {
        return res.status(401).json({
          status: 401,
          message:
            "You do not have the required permissions to perform this action.",
        });
      }
    }

    const event = await findEvent({ _id: eventId });

    if (!event) {
      return res.status(404).json({
        status: 404,
        message: "Event not found.",
      });
    }

    await deleteEvent({ _id: eventId });

    return res.status(200).json({
      status: 200,
      message: "Event deleted.",
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const updateEventHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "user._id");
    const eventId = get(req, "params.id");
    const counselorId = get(req, "params.createdBy");
    const update = req.body;

    if (String(counselorId) !== String(userId)) {
      if (String(userRole) !== "admin") {
        return res.status(401).json({
          status: 401,
          message:
            "You do not have the required permissions to perform this action.",
        });
      }
    }

    const event = await findEvent({ _id: eventId });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Invalid parameter. Event not found." });
    }

    const updateEvent = await findAndUpdate({ _id: eventId }, update, {
      new: true,
    });

    return res.status(200).json({ status: 200, event: updateEvent });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const subscribeEventHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "user._id");
    const eventId = get(req, "params.id");

    if (String(userRole) !== "student" || String(userRole) !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to perform this action.",
      });
    }

    const event = await findEvent({ _id: eventId });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Invalid parameter. Event not found." });
    }

    const newRequest = await createEventReq(req.body);
    if (!newRequest) {
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
    }

    return res.status(200).json({
      status: 200,
      request: newRequest,
      message: " You haveSuccessfully requested access to this event",
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const approveEventHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "user._id");
    const eventId = get(req, "params.id");

    if (String(userRole) !== "counselor" || String(userRole) !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to perform this action.",
      });
    }

    const event = await findEvent({ _id: eventId });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Invalid parameter. Event not found." });
    }

    if (
      String(event.createdBy) !== String(userId) &&
      String(userRole) !== "admin"
    ) {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to perform this action.",
      });
    }

    const updateEventReq = await findAndUpdateReq(
      { eventId: eventId },
      { $set: { status: "approved", dateApproved: new Date(Date.now()) } },
      { new: true }
    );

    if (updateEventReq) {
      // update event new
      const updateCurrentStudent = await updateStudent(
        { _id: updateEventReq.studentId },
        { $push: { subscribedEventIds: updateEventReq.studentId } },
        {
          new: false,
        }
      );

      // update events
      const updatedEvent = await findAndUpdate(
        { _id: eventId },
        { $push: { attendees: userId } },
        { new: true }
      );

      return res.status(200).json({ status: 200, event: updatedEvent });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Try again later",
      });
    }
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const denyEventRequestHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "user._id");
    const eventId = get(req, "params.id");

    if (String(userRole) !== "counselor" || String(userRole) !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to perform this action.",
      });
    }

    const event = await findEvent({ _id: eventId });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Invalid parameter. Event not found." });
    }

    if (
      String(event.createdBy) !== String(userId) &&
      String(userRole) !== "admin"
    ) {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to perform this action.",
      });
    }

    const updateEventReq = await findAndUpdateReq(
      { eventId: eventId },
      { $set: { status: "deny" } },
      { new: true }
    );

    if (updateEventReq) {
      return res
        .status(200)
        .json({ status: 200, message: "Student request has been denied" });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Try again later",
      });
    }
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};
