const fs = require("fs");
const yargs = require("yargs");

let contacts = loadContacts();

function loadContacts() {
  try {
    const contactsBuffer = fs.readFileSync("contacts.json");
    const contactsJSON = contactsBuffer.toString();
    return JSON.parse(contactsJSON);
  } catch (error) {
    return [];
  }
}

function saveContacts(contacts) {
  const contactsJSON = JSON.stringify(contacts);
  fs.writeFileSync("contacts.json", contactsJSON);
}


yargs.command({
  command: "add",
  describe: "Add a new contact",
  builder: {
    name: {
      describe: "Contact name",
      demandOption: true,
      type: "string",
    },
    phone: {
      describe: "Contact phone number",
      demandOption: true,
      type: "string",
    },
    email: {
      describe: "Contact email address",
      demandOption: true,
      type: "string",
    },
    notes: {
      describe: "Additional notes",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const newContact = {
      name: argv.name,
      phone: argv.phone,
      email: argv.email,
      notes: argv.notes,
    };
    contacts.push(newContact);
    saveContacts(contacts);
    console.log("Contact added successfully!");
  },
});


yargs.command({
  command: "remove",
  describe: "Remove a contact",
  builder: {

    name: {
      describe: "name of the contact you want to remove",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const contactIndex = contacts.findIndex(
      (contact) => contact.name === argv.name
    );
    if (contactIndex !== -1) {
      contacts.splice(contactIndex, 1);
      saveContacts(contacts);
      console.log("Contact removed successfully!");
    } else {
      console.log("Contact not found!");
    }
  },
});


yargs.command({
  command: "list",
  describe: "List all contacts",
  handler() {
    console.log("Your Contacts:");
    contacts.forEach((contact) => {
      console.log(`Name: ${contact.name}`);
      console.log(`Phone: ${contact.phone}`);
      console.log(`Email: ${contact.email}`);
      console.log(`Notes: ${contact.notes}`);
      console.log("*****************************");
    });
  },
});


yargs.command({
  command: "search",
  describe: "Search for a contact by phone",
  builder: {
    // name: {
    //   describe: "name of the contact to search for",
    //   demandOption: true,
    //   type: "string",
    // },
    notes:{
        describe: "relationship",
        demandOption: true,
        type: "string",
    }
  },
  handler(argv) {
    // const foundContacts = contacts.filter((contact) =>
    //   contact.name.toLowerCase().includes(argv.name.toLowerCase())
    // );
    // if (foundContacts.length > 0) {
    //   console.log("Matching Name found inside Contacts:");
    //   foundContacts.forEach((contact) => {
    //     console.log(`Name: ${contact.name}`);
    //     console.log(`Phone: ${contact.phone}`);
    //     console.log(`Email: ${contact.email}`);
    //     console.log(`Notes: ${contact.notes}`);
    //     console.log("--------------------------");
    //   });
    // } else {
    //   console.log("No matching contacts found.");
    // }

    const foundContacts = contacts.filter((notes) =>
      notes.notes.toLowerCase().includes(argv.notes.toLowerCase())
    );
    if (foundContacts.length > 0) {
      console.log("Matching Name found inside Contacts:");
      foundContacts.forEach((contact) => {
        console.log(`Name: ${contact.name}`);
        console.log(`Phone: ${contact.phone}`);
        console.log(`Email: ${contact.email}`);
        console.log(`Notes: ${contact.notes}`);
        console.log("--------------------------");
      });
    } else {
      console.log("No matching contacts found.");
    }
  },
});


yargs.command({
  command: "edit",
  describe: "Edit name of a contact",
  builder: {
    oldName: {
      describe: "Current name of the contact to edit",
      demandOption: true,
      type: "string",
    },
    newName: {
      describe: "New name for the contact",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const contactIndex = contacts.findIndex(
      (contact) => contact.name === argv.oldName
    );
    if (contactIndex !== -1) {
      contacts[contactIndex].name = argv.newName;
      saveContacts(contacts);
      console.log("Contact name updated successfully!");
    } else {
      console.log("Contact not found!");
    }
  },
});
yargs.parse();