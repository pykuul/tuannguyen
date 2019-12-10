import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// impport MUI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import components
import { styleTextField } from "../../lib/styled/SharedStyles";
import notify from "../../lib/notifier";
import logger from "../../../server/logs";
import { getGithubRepos } from "../../lib/api/admin";

const EditBook = props => {
  // define state
  const [{ book, repos }, setBook] = useState({
    book: props.book,
    repos: []
  });

  // componentDidMount()
  useEffect(async () => {
    // fetch all repos from gitHub
    try {
      const { repos } = await getGitHubRepos();
      // asign repos data to state
      setBook({ repos });
    } catch (err) {
      logger.error(err);
    }
  }, []);

  // render

  const onSubmitHandle = event => {
    event.preventDefault();

    const { name, price, githubRepo } = book;

    if (!name) {
      notify("Name is required");
      return;
    }

    if (!price) {
      notify("Price is Required");
      return;
    }

    if (!githubRepo) {
      notify("Github repo is required");
      return;
    }
    // save data
    props.onSave(book);
  };

  return (
    <div style={{ padding: "10px 45px" }}>
      <form onSubmit={onSubmitHandle}>
        <br />
        <div>
          <TextField
            onChange={event => {
              setBook({
                book: Object.assign({}, book, { name: event.target.value })
              });
            }}
            value={book.name}
            type="text"
            label="Book's title"
            labelClassName="textFieldLabel"
            style={styleTextField}
            required
          />
        </div>
        <br />
        <br />
        <TextField
          onChange={event => {
            setBook({
              book: Object.assign({}, book, {
                price: Number(event.target.value)
              })
            });
          }}
          value={book.price}
          type="number"
          label="Book's Price"
          className="textFieldInput"
          style={styleTextField}
          step="1"
          required
        />
        <br />
        <br />
        <div>
          <span>Github repo: </span>
          <Select
            value={book.githubRepo || ""}
            input={<Input />}
            onChange={event => {
              setBook({
                book: Object.assign({}, book, {
                  githubRepo: event.target.value
                })
              });
            }}
          >
            <MenuItem value="">
              <em>-- choose github repo --</em>
            </MenuItem>
            {repos.map(repo => (
              <MenuItem value={repo.full_name} key={repo.id}>
                {repo.full_name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <br />
        <br />
        <Button raised type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

// define defaultProps
EditBook.defaultProps = { book: {} };

EditBook.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }),
  onSave: PropTypes.func.isRequired
};

export default EditBook;
