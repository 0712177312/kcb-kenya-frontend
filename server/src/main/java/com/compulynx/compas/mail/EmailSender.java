package com.compulynx.compas.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class EmailSender {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String recipient, String subject, String emailContent) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(recipient);

        msg.setSubject(subject);
        msg.setText(emailContent);

        javaMailSender.send(msg);
    }
}
