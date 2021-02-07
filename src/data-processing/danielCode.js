import _ from "lodash";
const BASE_URL = "https://gmail.googleapis.com/gmail/v1/users";
const SENDER_NOT_FOUND = "sender_not_found";

const createMessageListUrl = googleId => `${BASE_URL}/${googleId}/messages`;

const createMessageUrl = (googleId, messageId) =>
  `${BASE_URL}/${googleId}/messages/${messageId}`;

export const mapBySender = (bySender, mapFn) => {
  return Object.keys(bySender).reduce(
    (aggregator, sender) => ({
      ...aggregator,
      [sender]: bySender[sender].map(mapFn)
    }),
    {}
  );
};

/**
 * 1. gets the sender from either the 'From' or 'Sender' header
 * 2. removes the trailing "<example@gmail.com>" from the string, so as to consolidate unique senders
 * 3. puts the message value inside a 'message' key in each object, along with a 'computed' key for us to add *our* computed/extracted info
 */
const groupBySender = allMessages => {
  const bySender = _.groupBy(allMessages, ({ payload }) => {
    let sender =
      payload.headers.find(({ name }) => name === "From") ||
      payload.headers.find(({ name }) => name === "Sender");

    return sender ? sender.value.split("<")[0] : SENDER_NOT_FOUND;
  });

  return mapBySender(bySender, message => ({
    message,
    computed: {}
  }));
};

/**
 * 1. extracts whether the message is unread
 */
const extractInfo = bySender =>
  mapBySender(bySender, msgObj => {
    const isUnread = msgObj.message.labelIds.includes("UNREAD");
    return {
      message: msgObj.message,
      computed: {
        isUnread
      }
    };
  });

/**
 * 1. calculates a few statistics
 */
const calculateStats = bySender =>
  Object.keys(bySender).reduce((aggregator, sender) => {
    const unread = bySender[sender].reduce(
      (acc, msgObj) => (msgObj.computed.isUnread ? acc + 1 : acc),
      0
    );
    const totalMessages = bySender[sender].length;

    return {
      ...aggregator,
      [sender]: {
        unread,
        totalMessages
      }
    };
  }, {});

export const processData = async (secureFetch, userDetails) => {
  const { googleId } = userDetails;

  const messageList = await secureFetch(
    createMessageListUrl(googleId)
  ).then(res => res.json());

  const messageRequests = messageList.messages
    .map(({ id }) => createMessageUrl(googleId, id))
    .map(url => secureFetch(url).then(res => res.json()));

  const allMessages = await Promise.all(messageRequests);

  const bySender = groupBySender(allMessages);
  const withExtractedInfo = extractInfo(bySender);
  const finalStats = calculateStats(withExtractedInfo);

  console.log(finalStats);
  return finalStats;
};
