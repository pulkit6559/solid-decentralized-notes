import React, { Component } from "react";

class Team extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ol class="list-group list-group-numbered">
        <h3 className="card-header">Members</h3>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">
              <b>Omar Mahmoud</b>
            </div>
            <p>
              Age: 33 <br />
              Based: Egypt <br />
              Studies: M.Sc. Data Science <br />
              Hobbies: Reading <br />
              Expertise: Java, SQL
            </p>
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">
              <b>Pulkit Arora</b>
            </div>
            <p>
              Age: 22 <br />
              Based: India <br />
              Studies: M.Sc. Media Informatics <br />
              Hobbies: Hiking, Reading <br />
              Expertise: Python, Flask <br />
            </p>
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">
              <b>Haihua Yang</b>
            </div>
            <p>
              Age: 24 <br />
              Based: China <br />
              Studies: M.Sc. Media Informatics <br />
              Hobbies: Badminton, Reading <br />
              Expertise: Java, javascript, python <br />
            </p>
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">
              <b>Timothy Clemens Borrell</b>
            </div>
            <p>
              Age: 24 <br />
              Based: Aachen/Münster <br />
              Studies: M.Sc. Data Science (2nd Semester) <br />
              Hobbies: Golf, Piano, Reading
              <br />
              Expertise: Python, Java, VBA, Latex, MATLAB <br />
            </p>
          </div>
        </li>
      </ol>
    );
  }
}

export default Team;
